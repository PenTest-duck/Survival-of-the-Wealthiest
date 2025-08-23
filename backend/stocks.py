import pandas as pd
from typing import List, Dict, Callable
import threading
import time
import asyncio

# Remove the circular import - we'll set this function reference later
kickoff_everyone_callback: Callable = None

def set_kickoff_callback(callback: Callable):
    """Set the callback function to be called on tick intervals"""
    global kickoff_everyone_callback
    kickoff_everyone_callback = callback

def read_stocks_data() -> List[Dict[str, float]]:
    """
    Read stocks.csv and convert to chronological list of dictionaries
    where each element represents one date with all stock symbols and their opening prices.
    
    Returns:
        List[Dict[str, float]]: List of dictionaries, each representing one date
        with stock symbols as keys and opening prices as values
    """
    # Read the CSV file
    df = pd.read_csv("stocks.csv")
    
    # Convert date column to datetime for proper sorting
    df['date'] = pd.to_datetime(df['date'])
    
    # Sort by date (chronological order)
    df_sorted = df.sort_values('date')
    
    # Group by date and create the desired format
    stocks_by_date = []
    current_date = None
    current_date_stocks = {}
    
    for _, row in df_sorted.iterrows():
        if current_date is None or row['date'] != current_date:
            # If we have data from previous date, add it to the list
            if current_date_stocks:
                stocks_by_date.append(current_date_stocks)
            
            # Start new date
            current_date = row['date']
            current_date_stocks = {row['Name']: row['open']}
        else:
            # Same date, add this stock
            current_date_stocks[row['Name']] = row['open']
    
    # Don't forget to add the last date's data
    if current_date_stocks:
        stocks_by_date.append(current_date_stocks)
    
    return stocks_by_date

STOCKS_DATA = read_stocks_data()

# === Tick mechanism ===
CURRENT_TICK = 0

def tick_incrementer():
    global CURRENT_TICK
    while True:
        time.sleep(10)
        CURRENT_TICK += 1
        if CURRENT_TICK % 6 == 1 and kickoff_everyone_callback:
            # Import here to avoid circular import
            from agents_store import AGENTS_STORE
            asyncio.run(kickoff_everyone_callback(list(AGENTS_STORE.values())))
        print(f"Tick: {CURRENT_TICK}")

_tick_thread = threading.Thread(target=tick_incrementer, daemon=True)
_tick_thread.start()
# === End of tick mechanism ===

def get_current_stocks() -> Dict[str, float]:
    return STOCKS_DATA[CURRENT_TICK]

def get_portfolio_data(portfolio: Dict[str, int]) -> List[Dict[str, float]]:
    stocks = get_current_stocks()
    return [
        {"symbol": stock, "shares": shares, "price": stocks[stock]}
        for stock, shares in portfolio.items()
    ]

# Example usage
if __name__ == "__main__":
    stocks_data = read_stocks_data()
    print(f"Total dates: {len(stocks_data)}")
    print("First 3 dates:")
    for i, date_data in enumerate(stocks_data[:3]):
        print(f"Date {i+1}: {date_data}")
