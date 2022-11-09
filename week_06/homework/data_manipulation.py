import pandas as pd

a3 = pd.read_json('a3cleanedonly2015.json')

pd.unique(a3.Armed)

pd.unique(a3.State)

a3_state_date = a3.groupby(['State', 'Date'], as_index=False).UID.count()

a3_state_date = a3_state_date.astype({'Date': 'datetime64', "State": "string"})

a3_state_date = a3_state_date.rename(columns={"UID": "Count"})

a3_state_date.to_json('a3states2015.json')
a3_state_date.to_csv('a3states2015.csv')

#state race

a3_state_race = a3.groupby(['State', 'Race'], as_index=False).UID.count()

a3_state_race = a3_state_race[a3_state_race.Race != ""]

a3_state_race = a3_state_race.astype({'State': 'string', "Race": "string"})

a3_state_race = a3_state_race.rename(columns={"UID": "Count"})

a3_state_race.to_json('a3statesrace2015.json')
a3_state_race.to_csv('a3statesrace2015.csv')
