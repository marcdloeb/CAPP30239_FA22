library(sf)
library(tidyverse)

###1920s
tract_1920 <-st_read("data/sources/source_shapefiles/us_tract_1920/US_tract_1920_conflated.shp")
#st_crs(tract_1920)
#"ESRI 102003, USA_Contiguous_Albers_Equal_Area_Conic
#reprojecting to EPSG:3857, Web Mercator, which is what MapBox uses
tract_1920 <- st_transform(tract_1920, crs = "EPSG:3857")

#Selecting Cook County Tracts Only
tract_1920 <- tract_1920 %>% 
  select(GISJOIN, STATE, COUNTY, Shape_Area) %>%
  filter(STATE == "17", COUNTY == "031") %>%
  rename(land_area = Shape_Area,
         state = STATE,
         county = COUNTY)
  
#clean, everything adds up
race_1920 <-read.csv("data/sources/source_csvs/1920_tract.csv") %>% 
  select(-STATE, -STATEA, -COUNTY, -COUNTYA, -AREANAME, -PRETRACTA, -TRACTA, -POSTTRCTA) %>%
  rename(total_pop = A94001,
         nat_white_nat_par = BAT001,
         nat_white_for_par = BAT002,
         nat_white_mix_par = BAT003,
         for_white = BAT004,
         black = BAT005,
         other = BAT006,
         year = YEAR) %>%
  mutate(white = nat_white_nat_par
         +nat_white_for_par
         +nat_white_mix_par
         +for_white, 
         white_per = 100 * white/total_pop,
         black_per = 100 * black/total_pop)

#joining tracts and race data via census tract code
tract_1920 <- left_join(tract_1920, race_1920, by = "GISJOIN")

#plot(tract_1920 %>% select(black_per))
st_write(tract_1920, "data/working_data/1920_race_tract.geojson")


###1930s
tract_1930 <-st_read("data/sources/source_shapefiles/us_tract_1930/US_tract_1930_conflated.shp")
#st_crs(tract_1930)
#"ESRI 102003, USA_Contiguous_Albers_Equal_Area_Conic
#reprojecting to EPSG:3857, Web Mercator
tract_1930 <- st_transform(tract_1930, crs = "EPSG:3857")

#selecting cook county tracts only
tract_1930 <- tract_1930 %>% 
  select(GISJOIN, STATE, COUNTY, Shape_Area) %>%
  filter(STATE == "17", COUNTY == "031") %>%
  rename(land_area = Shape_Area,
         state = STATE,
         county = COUNTY)
#	G17003100318 has less than total pop
race_1930 <-read.csv("data/sources/source_csvs/1930_tract.csv") %>% 
  select(-STATE, -STATEA, -COUNTY, -COUNTYA, -AREANAME, -PRETRACTA, -TRACTA, -POSTTRCTA) %>%
  rename(total_pop = BHI001,
         nat_white_nat_par = BIQ001,
         nat_white_formix_par = BIQ002,
         for_white = BIQ003,
         black = BIQ004,
         other = BIQ005,
         year = YEAR) %>% 
  mutate(white = nat_white_nat_par
         +nat_white_formix_par
         +for_white, 
         white_per = 100 * white/total_pop,
         black_per = 100 * black/total_pop)
         #total_count = white + black + other,
         #total_per = total_count/total_pop)

tract_1930 <- left_join(tract_1930, race_1930, by = "GISJOIN")
#plot(tract_1930 %>% select(black_per))
st_write(tract_1930, "data/working_data/1930_race_tract.geojson")


###1940s
tract_1940 <-st_read("data/sources/source_shapefiles/us_tract_1940/US_tract_1940_conflated.shp")
st_crs(tract_1940)
#"ESRI 102003, USA_Contiguous_Albers_Equal_Area_Conic
#reprojecting to EPSG:3857, Web Mercator
tract_1940 <- st_transform(tract_1940, crs = "EPSG:3857")

#selecting cook county tracts only
tract_1940 <- tract_1940 %>% 
  select(GISJOIN, STATE, COUNTY, Shape_Area) %>%
  filter(STATE == "17", COUNTY == "031") %>%
  rename(land_area = Shape_Area,
         state = STATE,
         county = COUNTY)

#clean, everything adds up properly
race_1940 <-read.csv("data/sources/source_csvs/1940_tract.csv") %>%
  filter(STATEA == "17", COUNTYA == "31") %>%
  select(-STATE, -STATEA, -COUNTY, -COUNTYA, -AREANAME, -PRETRACTA, -TRACTA, -POSTTRCTA) %>%
  rename(total_pop = BUB001,
         white = BUQ001,
         nonwhite = BUQ002,
         black = BVG001,
         year = YEAR) %>%
  mutate(white_per = 100 * white/total_pop,
         black_per = 100 * black/total_pop)

tract_1940 <- left_join(tract_1940, race_1940, by = "GISJOIN")
#plot(tract_1940 %>% select(black_per))
st_write(tract_1940, "data/working_data/1940_race_tract.geojson")
  
###1950s
tract_1950 <-st_read("data/sources/source_shapefiles/us_tract_1950/US_tract_1950_conflated.shp")
st_crs(tract_1950)
#"ESRI 102003, USA_Contiguous_Albers_Equal_Area_Conic
#reprojecting to EPSG:3857, Web Mercator
tract_1950 <- st_transform(tract_1950, crs = "EPSG:3857")

#selecting cook county tracts only
tract_1950 <- tract_1950 %>% 
  select(GISJOIN, COUNTY, Shape_Area) %>%
  filter(COUNTY == "031") %>%
  #data is missing state column for some reason
  mutate(state = substr(GISJOIN, 2, 3)) %>%
  filter(state == "17") %>%
  rename(land_area = Shape_Area,
         county = COUNTY)

#clean
race_1950 <-read.csv("data/sources/source_csvs/1950_tract.csv") %>% 
  filter(STATEA == "17", COUNTYA == "31") %>%
  select(-STATE, -STATEA, -COUNTY, -COUNTYA, -AREANAME, -PRETRACTA, -TRACTA, -POSTTRCTA) %>%
  rename(total_pop = BZ8001,
         white = B0J001,
         black = B0J002,
         other_nonwhite = B0J003,
         year = YEAR) %>%
  mutate(white_per = 100 * white/total_pop,
         black_per = 100 * black/total_pop)
         #total_count =  white + black + other_nonwhite,
         #total_per = total_count/total_pop)

tract_1950 <- left_join(tract_1950, race_1950, by = "GISJOIN")
#plot(tract_1950 %>% select(black_per))
st_write(tract_1950, "data/working_data/1950_race_tract.geojson")

###1960s
tract_1960 <-st_read("data/sources/source_shapefiles/us_tract_1960/US_tract_1960_conflated.shp")
st_crs(tract_1960)
#"ESRI 102003, USA_Contiguous_Albers_Equal_Area_Conic
#reprojecting to EPSG:3857, Web Mercator
tract_1960 <- st_transform(tract_1960, crs = "EPSG:3857")

#selecting cook county tracts only
tract_1960 <- tract_1960 %>% 
  select(GISJOIN, STATE, COUNTY, Shape_Area) %>%
  filter(STATE == "17", COUNTY == "031") %>%
  rename(land_area = Shape_Area,
         state = STATE,
         county = COUNTY)

#lots of problems
# race_1960 <-read.csv("data/sources/source_csvs/1960_tract.csv") %>%
#   filter(STATEA == "17", COUNTYA == "31") %>%
#   rename(total_pop = CA4001,
#          white = B7B001,
#          black = B7B002,
#          other = B7B003,
#          year = YEAR) %>%
#   select(GISJOIN, total_pop, white, black, other, year) %>%
#   mutate(white_per = 100 * white/total_pop,
#          black_per = 100 * black/total_pop,
#          total_count = white + black + other,
#          total_per = total_count/total_pop)

#calculating total population from the columns themselves
race_1960 <-read.csv("data/sources/source_csvs/1960_tract.csv") %>%
  filter(STATEA == "17", COUNTYA == "31") %>%
  rename(white = B7B001,
         black = B7B002,
         other = B7B003,
         year = YEAR) %>%
  select(GISJOIN, white, black, other, year) %>%
  mutate(total_pop = white + black + other,
         white_per = 100 * white/total_pop,
         black_per = 100 * black/total_pop)

tract_1960 <- left_join(tract_1960, race_1960, by = "GISJOIN")
#plot(tract_1960 %>% select(black_per))
st_write(tract_1960, "data/working_data/1960_race_tract.geojson")

###1970s
tract_1970 <-st_read("data/sources/source_shapefiles/us_tract_1970/US_tract_1970_conflated.shp")
st_crs(tract_1970)
#"ESRI 102003, USA_Contiguous_Albers_Equal_Area_Conic
#reprojecting to EPSG:3857, Web Mercator
tract_1970 <- st_transform(tract_1970, crs = "EPSG:3857")

#selecting cook county tracts only
tract_1970 <- tract_1970 %>% 
  select(GISJOIN, COUNTY, Shape_Area) %>%
  filter(COUNTY == "031") %>%
  #data is missing state column for some reason
  mutate(state = substr(GISJOIN, 2, 3)) %>%
  filter(state == "17") %>%
  rename(land_area = Shape_Area,
         county = COUNTY)

#there are no tracts where the black population exceeds 100%
race_1970 <-read.csv("data/sources/source_csvs/1970_tract.csv") %>%
  filter(STATEA == "17", COUNTYA == "31") %>%
  rename(total_pop = CY7001,
         black = CY8001,
         year = YEAR) %>%
  select(GISJOIN, total_pop, black, year) %>%
  mutate(black_per = 100 * black/total_pop)
         #pop_diff = total_pop - black)

tract_1970 <- left_join(tract_1970, race_1970, by = "GISJOIN")
#plot(tract_1970 %>% select(black_per))
st_write(tract_1970, "data/working_data/1970_race_tract.geojson")

###1980s
tract_1980 <-st_read("data/sources/source_shapefiles/us_tract_1980/US_tract_1980_conflated.shp")
st_crs(tract_1980)
#"ESRI 102003, USA_Contiguous_Albers_Equal_Area_Conic
#reprojecting to EPSG:3857, Web Mercator
tract_1980 <- st_transform(tract_1980, crs = "EPSG:3857")

#selecting cook county tracts only
tract_1980 <- tract_1980 %>% 
  select(GISJOIN, COUNTY, Shape_Area) %>%
  filter(COUNTY == "031") %>%
  #data is missing state column for some reason
  mutate(state = substr(GISJOIN, 2, 3)) %>%
  filter(state == "17") %>%
  rename(land_area = Shape_Area,
         county = COUNTY)

#clean
race_1980 <-read.csv("data/sources/source_csvs/1980_tract.csv") %>%
  filter(STATEA == "17", COUNTYA == "31") %>%
  rename(total_pop = C6W001,
         white = C6X001,
         black = C6X002,
         native = C6X003,
         asian = C6X004,
         other = C6X005,
         year = YEAR) %>%
  select(GISJOIN, total_pop, white, black, native, asian, other, year) %>%
  mutate(white_per = 100 * white/total_pop,
         black_per = 100 * black/total_pop)
         #total_count = white + black + native + asian + other,
         #total_per = total_count/total_pop)

tract_1980 <- left_join(tract_1980, race_1980, by = "GISJOIN")
#plot(tract_1980 %>% select(black_per))
st_write(tract_1980, "data/working_data/1980_race_tract.geojson")


###Street Address Points
street_addr <-read.csv("data/working_data/street_addr.csv")
#removing trailing whitespace
street_addr$publication <- trimws(street_addr$publication, which = c("both"))
street_addr$edition <- trimws(street_addr$edition, which = c("both"))
street_addr <- street_addr %>%
  rename(html_source = search_and_address,
         full_addr = full) %>%
  select(-old_search, -old_addr, -addr, -city_state)

street_addr_sf <- st_as_sf(street_addr, coords = c("lon", "lat"))
#internet said that this was supposed to be "EPSG:3857"! Took me like an hour to trial and error
st_crs(street_addr_sf) = "EPSG:4326"
street_addr_sf <- st_transform(street_addr_sf, crs = "EPSG:3857")
#saving as a geojson
st_write(street_addr_sf, "data/working_data/all_uncleaned_street_addr.geojson")

###removing duplicates
#need to search multiple permutations of the same address
#eg "6311 COTTAGE GROVE" and "6311 South COTTAGE GROVE"
#means that duplicates occasionally exist
#reduces number of observations from 56608 to 56172
street_addr_clean <- street_addr %>% 
  group_by(full_addr, publication, edition, day, month, year, geoaddress, lat, lon) %>% 
  summarise(quantity = max(quantity))
street_addr_clean <- street_addr_clean %>% ungroup()

str_addr_sf_clean <- st_as_sf(street_addr_clean, coords = c("lon", "lat"))
#internet said that this was supposed to be "EPSG:3857"! Took me like an hour to trial and error
st_crs(str_addr_sf_clean) = "EPSG:4326"
str_addr_sf_clean <- st_transform(str_addr_sf_clean, crs = "EPSG:3857")
st_write(str_addr_sf_clean , "data/working_data/all_cleaned_street_addr.geojson")

###limiting to just the Maroon articles in the area of study
#str_addr_sf_clean <- st_read("data/working_data/all_cleaned_street_addr.geojson")

str_addr_sf_maroon <- str_addr_sf_clean %>% 
  filter(publication == "Daily Maroon") %>%
  #no edition data for Maroon anyways
  select(-edition)
#st_write(str_addr_sf_maroon, "data/working_data/maroon_street_addr.geojson")

chicago_polys <-st_read("data/working_data/chicago_polys.geojson")
study_area <- chicago_polys[chicago_polys$name == "study_area",]
neighborhoods <- chicago_polys[chicago_polys$name != "study_area",]

#hacky way of doing an intersection that is faster that st_intersection, and avoids the attribute join
str_addr_sf_nb <- str_addr_sf_maroon[st_intersects(str_addr_sf_maroon, study_area) %>% lengths > 0,]
str_addr_sf_nb <- st_join(str_addr_sf_nb, neighborhoods %>% select(-id))
str_addr_sf_nb <- str_addr_sf_nb %>% rename(nbhood = name)
st_write(str_addr_sf_nb, "data/working_data/nbhood_street_addr.geojson")

### Address searches with slight semantic differences catch the same peice of text
### eg "6311 COTTAGE GROVE" and "6311 South COTTAGE GROVE"
# street_addr_preserved_searches <- street_addr %>% 
#   group_by(full_addr, publication, edition, day, month, year, geoaddress) %>% 
#   summarise(quantity = max(quantity), 
#             searches = list(unique(search)))
# 
# street_addr_preserved_searches %>%
#   ungroup %>%
#   unnest(cols = c(searches))
# 
# for (search_list in street_addr_preserved_searches$searches) {
#   if (length(search_list) >1) {
#     print(search_list)
#   }
# }

### pivoting data so that neighbrhood is on the y axis and year is on the x
str_addr_sf_nb <- st_read("data/working_data/nbhood_street_addr.geojson")


### Assigning neighborhood to each census tract
chicago_polys <-st_read("data/working_data/chicago_polys_for_tracts.geojson")
study_area <- chicago_polys[chicago_polys$name == "study_area",]
neighborhoods <- chicago_polys[chicago_polys$name != "study_area",]

tract_1920 <- st_read("data/working_data/1920_race_tract.geojson")
tract_1920_nb <- st_join(tract_1920, neighborhoods %>% select(-id))
tract_1920_nb <- tract_1920_nb %>% 
  rename(neighborhood = name) %>% 
  filter(!is.na(neighborhood))
plot(tract_1920_nb %>% select(neighborhood))
st_write(tract_1920_nb, "data/working_data/1920_race_tract_nb.geojson")

tract_1930 <- st_read("data/working_data/1930_race_tract.geojson")
tract_1930_nb <- st_join(tract_1930, neighborhoods %>% select(-id))
tract_1930_nb <- tract_1930_nb %>% 
  rename(neighborhood = name) %>% 
  filter(!is.na(neighborhood))
plot(tract_1930_nb %>% select(neighborhood))
st_write(tract_1930_nb, "data/working_data/1930_race_tract_nb.geojson")

tract_1940 <- st_read("data/working_data/1940_race_tract.geojson")
tract_1940_nb <- st_join(tract_1940, neighborhoods %>% select(-id))
tract_1940_nb <- tract_1940_nb %>% 
  rename(neighborhood = name) %>% 
  filter(!is.na(neighborhood))
plot(tract_1940_nb %>% select(neighborhood))
st_write(tract_1940_nb, "data/working_data/1940_race_tract_nb.geojson")

tract_1950 <- st_read("data/working_data/1950_race_tract.geojson")
tract_1950_nb <- st_join(tract_1950, neighborhoods %>% select(-id))
tract_1950_nb <- tract_1950_nb %>% 
  rename(neighborhood = name) %>% 
  filter(!is.na(neighborhood))
plot(tract_1950_nb %>% select(neighborhood))
st_write(tract_1950_nb, "data/working_data/1950_race_tract_nb.geojson")

tract_1960 <- st_read("data/working_data/1960_race_tract.geojson")
tract_1960_nb <- st_join(tract_1960, neighborhoods %>% select(-id))
tract_1960_nb <- tract_1960_nb %>% 
  rename(neighborhood = name) %>% 
  filter(!is.na(neighborhood))
plot(tract_1960_nb %>% select(neighborhood))
st_write(tract_1960_nb, "data/working_data/1960_race_tract_nb.geojson")

tract_1970 <- st_read("data/working_data/1970_race_tract.geojson")
tract_1970_nb <- st_join(tract_1970, neighborhoods %>% select(-id))
tract_1970_nb <- tract_1970_nb %>% 
  rename(neighborhood = name) %>% 
  filter(!is.na(neighborhood))
plot(tract_1970_nb %>% select(neighborhood))
st_write(tract_1970_nb, "data/working_data/1970_race_tract_nb.geojson")

tract_1980 <- st_read("data/working_data/1980_race_tract.geojson")
tract_1980_nb <- st_join(tract_1980, neighborhoods %>% select(-id))
tract_1980_nb <- tract_1980_nb %>% 
  rename(neighborhood = name) %>% 
  filter(!is.na(neighborhood))
plot(tract_1980_nb %>% select(neighborhood))
st_write(tract_1980_nb, "data/working_data/1980_race_tract_nb.geojson")

###finding average for each neighborhood

tract_1920_nb <- st_read("data/working_data/1920_race_tract_nb.geojson")
tract_1920_grouped <- tract_1920_nb %>%
  group_by(neighborhood) %>%
  summarize(black_per = sum(black)/sum(total_pop))
plot(tract_1920_grouped %>%select(black_per))
st_write(tract_1920_grouped, "data/working_data/1920_race_tract_grouped.geojson")

tract_1930_nb <- st_read("data/working_data/1930_race_tract_nb.geojson")
tract_1930_grouped <- tract_1930_nb %>%
  group_by(neighborhood) %>%
  summarize(black_per = sum(black)/sum(total_pop))
plot(tract_1930_grouped %>%select(black_per))
st_write(tract_1930_grouped, "data/working_data/1930_race_tract_grouped.geojson")

tract_1940_nb <- st_read("data/working_data/1940_race_tract_nb.geojson")
tract_1940_grouped <- tract_1940_nb %>%
  group_by(neighborhood) %>%
  summarize(black_per = sum(black)/sum(total_pop))
plot(tract_1940_grouped %>%select(black_per))
st_write(tract_1940_grouped, "data/working_data/1940_race_tract_grouped.geojson")

tract_1950_nb <- st_read("data/working_data/1950_race_tract_nb.geojson")
tract_1950_grouped <- tract_1950_nb %>%
  group_by(neighborhood) %>%
  summarize(black_per = sum(black)/sum(total_pop))
plot(tract_1950_grouped %>%select(black_per))
st_write(tract_1950_grouped, "data/working_data/1950_race_tract_grouped.geojson")

tract_1960_nb <- st_read("data/working_data/1960_race_tract_nb.geojson")
tract_1960_grouped <- tract_1960_nb %>%
  group_by(neighborhood) %>%
  summarize(black_per = sum(black)/sum(total_pop))
plot(tract_1960_grouped %>%select(black_per))
st_write(tract_1960_grouped, "data/working_data/1960_race_tract_grouped.geojson")

tract_1970_nb <- st_read("data/working_data/1970_race_tract_nb.geojson")
tract_1970_grouped <- tract_1970_nb %>%
  group_by(neighborhood) %>%
  summarize(black_per = sum(black)/sum(total_pop))
plot(tract_1970_grouped %>%select(black_per))
st_write(tract_1970_grouped, "data/working_data/1970_race_tract_grouped.geojson")

tract_1980_nb <- st_read("data/working_data/1980_race_tract_nb.geojson")
tract_1980_grouped <- tract_1980_nb %>%
  group_by(neighborhood) %>%
  summarize(black_per = sum(black)/sum(total_pop))
plot(tract_1980_grouped %>%select(black_per))
st_write(tract_1980_grouped, "data/working_data/1980_race_tract_grouped.geojson")

all_nb_blackper <- data.frame(neighborhood = tract_1920_grouped$neighborhood,
                     blackper_1920 = tract_1920_grouped$black_per,
                     blackper_1930 = tract_1930_grouped$black_per,
                     blackper_1940 = tract_1940_grouped$black_per,
                     blackper_1950 = tract_1950_grouped$black_per,
                     blackper_1960 = tract_1960_grouped$black_per,
                     blackper_1970 = tract_1970_grouped$black_per,
                     blackper_1980 = tract_1980_grouped$black_per)

st_write(all_nb_blackper, "data/working_data/all_nb_blackper.geojson")
