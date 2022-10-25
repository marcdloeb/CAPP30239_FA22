library(sf)
library(tidyverse)

#1920s
tract_1920 <-st_read("data/sources/source_shapefiles/us_tract_1920/US_tract_1920_conflated.shp")
st_crs(tract_1920)
#"ESRI 102003, USA_Contiguous_Albers_Equal_Area_Conic 
tract_1920 <- tract_1920 %>% 
  select(GISJOIN, STATE, COUNTY, Shape_Area) %>%
  filter(STATE == "17", COUNTY == "031")
  
race_1920 <-read.csv("data/sources/source_csvs/1920_tract.csv")
race_1920 <- race_1920 %>% 
  select(-STATE, -COUNTY, -AREANAME, -PRETRACTA, -TRACTA, -POSTTRCTA) %>%
  rename(total_population = A94001,
         native_white_native_parents = BAT001,
         native_white_foreign_parents = BAT002,
         native_white_mixed_parents = BAT003,
         foreign_white = BAT004,
         black = BAT005,
         other_colored = BAT006) %>%
  mutate(white = native_white_native_parents
         +native_white_foreign_parents
         +native_white_mixed_parents
         +foreign_white, 
         white_per = 100 * white/total_population,
         black_per = 100 * black/total_population)

tract_1920 <- left_join(tract_1920, race_1920, by = "GISJOIN")
#plot(tract_1920 %>% select(black_per))
st_write(tract_1920, "data/working_data/1920_race_tract.geojson")


#1930s
tract_1930 <-st_read("data/sources/source_shapefiles/us_tract_1930/US_tract_1930_conflated.shp")

#1940s
tract_1940 <-st_read("data/sources/source_shapefiles/us_tract_1940/US_tract_1940_conflated.shp")