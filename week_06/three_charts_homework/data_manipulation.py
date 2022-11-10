import pandas as pd

a3 = pd.read_json('a3cleanedonly2015.json')
pd.unique(a3.Armed)
pd.unique(a3.State)

top_states = a3.groupby(["State"], as_index=False).UID.count()
top_states = top_states.rename(columns={"UID": "Total"})
top_states = top_states.sort_values(["Total"], ascending=False)
top_states = top_states.astype({"State": "string"})

a3.State[~a3.State.isin(list(top_states.head(11).State.unique()))] = "Other"

a3_state_date = a3.groupby(['State', 'Date'], as_index=False).UID.count()
a3_state_date = a3_state_date.astype({'Date': 'datetime64', "State": "string"})
a3_state_date = a3_state_date.rename(columns={"UID": "Count"})

# a3_state_date["Cumulative"] = a3_state_date.groupby([
#                    a3_state_date.State, df.paid.cumsum().shift().fillna(0)
#                ]).n_items.cumsum()

a3_state_date.to_json('data/a3states_date2015.json')
a3_state_date.to_csv('data/a3states_date2015.csv')



# state race
a3_state_race = a3.groupby(['State', 'Race'], as_index=False).UID.count()
a3_state_race = a3_state_race[a3_state_race.Race != ""]
a3_state_race = a3_state_race.astype({'State': 'string', "Race": "string"})
a3_state_race = a3_state_race.rename(columns={"UID": "Count"})
a3_state_race.to_json('data/a3states_race2015_v1.json', orient = "index")

# state race alternative structure
a3_state_race_alt = a3[a3.Race != ""]
a3_state_race_alt = a3_state_race_alt.groupby(['State', 'Race'], as_index="State").UID.count()
a3_state_race_alt.to_json('data/a3states_race2015_v2.json', orient = "index")

# Neither of these give me the json format that I need!


