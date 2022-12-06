A present, this directory contains only the data that is going to be used as part of my final project, and the code used to clean and shape that data.

My final project has two main data sources: historical census data (from the 1920 to 1980 Decennial Censuses) on race in Cook County, Illinois, and street addresses that appear in the 20th century editions of the Daily Maroon, the print student publication of the University of Chicago.

- data_manip.txt
  - A txt file that exists solely to let me write code that requires multiline editing

- geojson_creation.Rmd
  - An R Markdown file (approx 700 lines) used to transform source CSVs and Shapefiles into the JSONs and CSVs that will form the basis of my maps and charts

- data
  - This directory contains both the source data and cleaned data to be used to create my maps and charts. It contains the following subdirectories
  - chart_data
    - This directory contains neighborhood level data on street addresses and race that will serve as the basis for charts
  - map_data
    - This directory contains GeoJSONs for race by census tract, and street address points. This data will serve as the basis for maps
   - map_topos
    - This directory contains the GeoJSONs converted to TopoJSONs
   - neighborhood_polygons
    - This directory contains the polygons used to assign neighborhood labels to each census tract and street address point
  - sources
    - This directory contains the raw data that is manipulated into chart_data and map_data
    - census_csvs
      - This subdirectory contains the Census datatables for race in the United States by Census tract
    - census_shapefiles
      - This subdirectory contains the Census tract shapefiles. This folder only exists locally, because many of the shapefiles exceed github's 100mb cap
    - street_addresses
      - This subdirectory contains the CSV recording more than 56,000 street addresses that appear in 20th century University of Chicago print publications
    - neighborhood_polys
      - This subdirectory contains the polygons used to assign neighborhood names to street address points and census tracts, to enable later aggregation
  - working_data
    - This directory contains intermediate data, middle stages of transformation of source data into chart_data and map_data
