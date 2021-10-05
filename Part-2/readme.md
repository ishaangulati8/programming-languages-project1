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

## Modified Grammar to Cancel Trades for given stock(s):
```
<stock_trade_requests> → ‘(' <trade> {‘,’ <trade>} ‘)  <account_substr> 
| 'Cancel' (<stock_symbol> {, <stock_symbol>}) 'trade' <account_substr>
<trade> → <number> <stock_symbol> ‘shares’ (‘buy at max' | ‘sell at min') <number>
<number> →  [1-9] {[0-9]}
<stock_symbol> →
 'AAPL'|'HP'|'IBM'|'AMZN'|'MSFT'|'GOOGL'|'INTC'|'CSCO'|'ORCL'|'QCOM'
<acct_ident> →  ‘“‘alpha_char { alpha_char | digit | ’_’} ‘“‘
<account_substr> -> for account' <acct_ident>’.’
```


## Modified JSON structure for to include cancel trade requests:
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
    "cancel": [
        "GOOGL"
    ]
}

```

The `cancel` key in the above json object is an array containing stock symbol(s) for which trade is to be cancelled. We can cancel trades of more than one stock at a time.


## SQL Statement:
For cancelling the trade of the stocks `updated` statement is being used and `CancelledAt` is set to the current time using `now()` sql(postgresql) function.


## Running the program:
The program can be run using makefile. You need to change your directory to Part-2 using `cd Part-2`. To run the program please use `make json=JSONFILENAME.json run`.
