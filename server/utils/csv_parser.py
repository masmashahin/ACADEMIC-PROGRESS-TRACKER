import pandas as pd

def read_and_validate_csv(file, required_headers):
    try:
        df = pd.read_csv(file)
        if not all(header in df.columns for header in required_headers):
            raise ValueError(f"Missing required headers: {', '.join(required_headers)}")
        return df
    except pd.errors.EmptyDataError:
        raise ValueError("Empty CSV file")
    except pd.errors.ParserError as e:
        raise ValueError(f"Invalid CSV file: {e}")
