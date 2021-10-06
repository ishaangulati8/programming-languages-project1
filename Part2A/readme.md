# **Part 2**

## Given Dsl Grammar:
```
<stock_trade_requests> →  ‘(' <trade> {‘,’ <trade>} ‘) for account' <acct_ident>’.’
<trade> → <number> <stock_symbol> ‘shares’ (‘buy at max' | ‘sell at min') <number>
<number> →  [1-9] {[0-9]}
<stock_symbol> →
 'AAPL'|'HP'|'IBM'|'AMZN'|'MSFT'|'GOOGL'|'INTC'|'CSCO'|'ORCL'|'QCOM'
<acct_ident> →  ‘“‘alpha_char { alpha_char | digit | ’_’} ‘“‘

```

## Given Json:
```json
{
    "user id": "Hokie123",
    "buy": [
        {
            "stock symbol": "IBM",
            "shares": 100,
            "at max": 45
        },
        {
            "stock symbol": "GOOGL",
            "shares": 50,
            "at max": 60
        },
        {
            "stock symbol": "AMZN",
            "shares": 120,
            "at max": 70
        }
    ],
    "sell": [
        {
            "stock symbol": "GOOGL",
            "shares": 20,
            "at min": 40
        },
        {
            "stock symbol": "ORCL",
            "shares": 30,
            "at min": 25
        }
    ],
}
```
## Running the program:
The program can be run using makefile. You need to change your directory to Part2A using `cd Part2A`. To run the program please use `make json=JSONFILENAME.json run`. The run command would first delete the existing `.json` and `.sql` present in current directory, then execute the program and produce the output into corresponding `.sql` and `.dsl` files.
