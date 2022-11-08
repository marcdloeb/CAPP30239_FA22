import pandas as pd

a3 = pd.read_json('a3cleanedonly2015.json')

pd.unique(a3.Armed)

pd.unique(a3.State)