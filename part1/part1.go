package main

import (
	"fmt"
	"strings"
	"unicode"
	"os"
)

// we use an ordered list to represent the symbal table
type symbol struct {
	symbol_index int
	token string
 	decimal_val int 
}

type operator struct {
	lexeme string
	token string
}


const (
	roman_symbols = "IVXLCDM"
) 

var (

	input_str string = ""

	lexemes []string
	lexeme_index int = 0

	next_token string

	symbol_table [100]symbol

	operators = []operator {
		operator{
			lexeme: "plus",
			token: "ADD_OP",
		},
		operator{
			lexeme: "minus",
			token: "SUB_OP",
		},
		operator{
			lexeme: "times",
			token: "MULT_OP",
		},
		operator{
			lexeme: "divide",
			token: "DIV_OP",
		},
		operator{
			lexeme: "modulo",
			token: "MOD_OP",
		},
		operator{
			lexeme: "power",
			token: "POW_OP",
		},
	}


)


func main() {

	// read input from command line argument
	if len(os.Args) != 2 {
		fmt.Println("Please enter an expression in quotes")
		return
	}
	input_str = os.Args[1]

	/* format input by detatching parenthesis, and splitting input into string 
	slice using " " delimiter. */
	formatInput()

	recursiveDescentParse()

	// check for extraneous lexemes
	if next_token != "EOF"{
		syntaxError()
	}
}

// attempt to tokenize the next lexeme
func lex() {

	// no more lexemes to tokenize
	if lexeme_index >= len(lexemes){
		next_token = "EOF"
		return
	} 

	lexeme := lexemes[lexeme_index]

	// used to store the decimal value of a roman numeral
	roman_num := 0

	// if the lexeme is uppercase and starts with a letter, evaluate as a roman numeral
	r := []rune(lexeme)
	if strings.ToUpper(lexeme) == lexeme && unicode.IsLetter(r[0]) {
		roman_num = toArabic(lexeme)
		next_token = "NUM"
	
	} else if unicode.IsLetter(r[0])  {  // else if lexeme starts with a letter, evaluate as operator
		op_index := 0
		for op_index = range operators {
    		if operators[op_index].lexeme == lexeme {
        		next_token = operators[op_index].token
        		break
    		}

    		// if no operators are found - its a lexical error
    		if op_index + 1 == len(operators) {
    			lexicalError()
    		}
		}
		
	}  else { // else evaluate as paren
		switch lexeme {
		case "(","{","[":
			next_token = "OPEN_PAREN"
		case ")","}","]":
			next_token = "CLOSE_PAREN"

		default:
			lexicalError()
		}
	}
	
	// add token to symbol table
	symbol_table[lexeme_index].symbol_index = lexeme_index
	symbol_table[lexeme_index].token = next_token
	if next_token == "NUM"{
		symbol_table[lexeme_index].decimal_val = roman_num
	}

	fmt.Printf("Next token is: %s\n", next_token)
		
	// get ready for next call to lex
	lexeme_index++
}


// starts the recursive descent parsing process by calling the root parsing subprogram
func recursiveDescentParse() {

	// get first token
	lex()

	// attempt to parse the input token by token
	expr()
}













/*****************************************************************/
//  recursive-descent parsing subprograms
/*****************************************************************/

/* expr
Parses strings in the language generated by the rule: 
<expr> -> <term> { (ADD_OP | SUB_OP) <term> }
*/
func expr(){
	fmt.Printf("Enter <expr>\n")
	
	// Parse the first term 
  	term()

	//As long as the next token is ADD_OP or SUB_OP, get the next token and parse the next term 
	for next_token == "ADD_OP" || next_token == "SUB_OP" { 
		lex()
		term()
	}

  	fmt.Printf("Exit <expr>\n")
}

/* term
Parses strings in the language generated by the rule: 
<term> -> <factor> { (MULT_OP | DIV_OP | MOD_OP) <factor> }
*/
func term() {
	fmt.Printf("Enter <term>\n")
	// Parse the first factor 
	factor()
	// As long as the next token is MULT_OP or DIV_OP or MOD_OP, get the next token and parse the next factor */
	for next_token == "MULT_OP" || next_token == "DIV_OP" || next_token == "MOD_OP" {
		lex()
		factor()
	}
	fmt.Printf("Exit <term>\n")
} 

/* factor
Parses strings in the language generated by the rule: 
<factor> -> NUM [POW_OP <expr>]
		 -> OPEN_PAREN <expr> CLOSE_PAREN [POW_OP <expr>]
*/
func factor() {
	fmt.Printf("Enter <factor>\n")
	// Determine which RHS
	if next_token == "NUM" {

		lex()

		// IF the next token is POW_OP, get the next token and call expr 
		if next_token == "POW_OP" {
			lex()
			expr()
		}
		/* If the RHS is OPEN_PAREN <expr> CLOSE_PAREN <optionexp>, call lex to pass over the
		OPEN_PAREN, call expr, and make sure there's a the CLOSE_PAREN
		is POW_OP */
	} else {
		if (next_token == "OPEN_PAREN") {
			lex()
			expr()
			if (next_token == "CLOSE_PAREN"){
				lex()

				// IF the next token is POW_OP, get the next token and call expr 
				if next_token == "POW_OP" {
					lex()
					expr()
				}
			} else{
				// there was no CLOSE_PAREN
				syntaxError()
			}
			
		} else {
			// It was not an NUM, or an OPEN_PAREN 
			syntaxError()
		}
	} /* End of else */
	fmt.Printf("Exit <factor>\n")
} 






















/*****************************************************************/
// helper functions
/*****************************************************************/

// detatch parenthesis and split input into string slice using " " delimiter
func formatInput() {

	input_str = strings.TrimSpace(input_str)
	input_slice := strings.Split(input_str,"")
	str := ""
	for index := range input_slice {
		if isParen(input_slice[index]){
			if str != "" {
				lexemes = append(lexemes, str)
				lexemes = append(lexemes, input_slice[index])
				str = ""
			} else {
				lexemes = append(lexemes, input_slice[index])
			}
		} else if input_slice[index] == " " {
			if str != "" {
				lexemes = append(lexemes, str)
			}
			str = ""
		} else {
			str += input_slice[index]
		}


		if index == len(input_slice) - 1 && str != ""{
			lexemes = append(lexemes, str)
		}
	}
	// check if input is longer than symbol table capacity
	if len(lexemes) > len(symbol_table) {
		fmt.Println("ERROR: Input too long")
	}
}

func isParen(str string) bool {
	if str == "(" || str == "{" || str == "[" || str == ")" || str == "}" || str == "]" {
		return true
	}
	return false
}

// returns the decimal value of a roman numeral 
func toArabic (numeral string) int {

	// base case
	if numeral == "" {
		return 0
	}

	// invalid syntax
    if strings.HasPrefix(numeral,"IL") 	{lexicalError()}
    if strings.HasPrefix(numeral,"IC") 	{lexicalError()}
    if strings.HasPrefix(numeral,"ID") 	{lexicalError()}
    if strings.HasPrefix(numeral,"IM") 	{lexicalError()}
    if strings.HasPrefix(numeral,"VX") 	{lexicalError()}
    if strings.HasPrefix(numeral,"VL") 	{lexicalError()}
    if strings.HasPrefix(numeral,"VC") 	{lexicalError()}
    if strings.HasPrefix(numeral,"VD") 	{lexicalError()}
    if strings.HasPrefix(numeral,"VM") 	{lexicalError()}
    if strings.HasPrefix(numeral,"XD") 	{lexicalError()}
    if strings.HasPrefix(numeral,"XM") 	{lexicalError()}
    if strings.HasPrefix(numeral,"LC") 	{lexicalError()}
    if strings.HasPrefix(numeral,"LD") 	{lexicalError()}
    if strings.HasPrefix(numeral,"LM") 	{lexicalError()}
    if strings.HasPrefix(numeral,"IIII"){lexicalError()}
    if strings.HasPrefix(numeral,"VV") 	{lexicalError()}
    if strings.HasPrefix(numeral,"XXXX"){lexicalError()}
    if strings.HasPrefix(numeral,"LL")	{lexicalError()}
    if strings.HasPrefix(numeral,"CCCC"){lexicalError()}
    if strings.HasPrefix(numeral,"DD")	{lexicalError()}
    if strings.HasPrefix(numeral,"MMMM"){lexicalError()}

    if strings.HasPrefix(numeral,"CM") && numeral[2:] != "" {lexicalError()} 
    if strings.HasPrefix(numeral,"CD") && numeral[2:] != "" {lexicalError()}
    if strings.HasPrefix(numeral,"XC") && numeral[2:] != "" {lexicalError()}
    if strings.HasPrefix(numeral,"XL") && numeral[2:] != "" {lexicalError()}
    if strings.HasPrefix(numeral,"IX") && numeral[2:] != "" {lexicalError()}
    if strings.HasPrefix(numeral,"IV") && numeral[2:] != "" {lexicalError()}


    // valid syntax
    if strings.HasPrefix(numeral,"M") 	{return (1000 + toArabic(numeral[1:]))}
    if strings.HasPrefix(numeral,"CM") 	{return (900 + toArabic(numeral[2:]))}
    if strings.HasPrefix(numeral,"D") 	{return (500 + toArabic(numeral[1:]))}
    if strings.HasPrefix(numeral,"CD") 	{return (400 + toArabic(numeral[2:]))}
    if strings.HasPrefix(numeral,"C") 	{return (100 + toArabic(numeral[1:]))}
    if strings.HasPrefix(numeral,"XC") 	{return (90 + toArabic(numeral[2:]))}
    if strings.HasPrefix(numeral,"L") 	{return (50 + toArabic(numeral[1:]))}
    if strings.HasPrefix(numeral,"XL") 	{return (40 + toArabic(numeral[2:]))}
    if strings.HasPrefix(numeral,"X") 	{return (10 + toArabic(numeral[1:]))}
    if strings.HasPrefix(numeral,"IX") 	{return (9 + toArabic(numeral[2:]))}
    if strings.HasPrefix(numeral,"V") 	{return (5 + toArabic(numeral[1:]))}
    if strings.HasPrefix(numeral,"IV") 	{return (4 + toArabic(numeral[2:]))}
    if strings.HasPrefix(numeral,"I") 	{return (1 + toArabic(numeral[1:]))}
    
    // if execution makes it here, something went wrong
    lexicalError()
    return 0 
}

// format output to point to proper lexeme 
func lexicalError(){

	fmt.Println("\n" + strings.Join(lexemes, " "))

	space_count := 0

	for i := 0; i < lexeme_index; i++ {
 		space_count += (len(lexemes[i]) + 1)
	}

	for i := 0; i < space_count; i++{
		fmt.Printf(" ")
	}
	fmt.Println("^")
	fmt.Println("Quid dicis? You offend Caesar with your sloppy lexical habits!\n")
	os.Exit(3)
}

// format output to point to proper lexeme 
func syntaxError(){

	fmt.Println("\n" + strings.Join(lexemes, " "))

	space_count := 0

	for i := 0; i < lexeme_index-1; i++ {
 		space_count += (len(lexemes[i]) + 1)
	}

	for i := 0; i < space_count; i++{
		fmt.Printf(" ")
	}
	fmt.Println("^")
	fmt.Println("Quid dicis? True Romans would not understand your syntax!\n")
	os.Exit(3)
}



