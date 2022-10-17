# CAPP 30239 Autumn 2022 Week 3 Repo

# Description

This repository contains the files used during the course of the third week of the Autumn 2022 CAPP Data Visualization course.

Some pertain to classwork. 

- covid.csv
- index.html
- script.js

Were all used as part of class excercises.

The csvs housed in the street_address_data directory are the data for my final project. They are described further below.

# Final Project Data Description

## Street Address Data

This data consists of over 56,000 points, spread over a more than 90 year period, stretching from the 1890s to the 1980s. Each one corresponds to a street address that appears in a University of Chicago campus publication, the majority from the Maroon, the University's student paper. Most of these addresses appear as part of advertisements, usually for apartments or businesses, looking for customers among the students and faculty. As a consequence, they serve as a running record of the geographic extent of the university community, which can be compared to other variables, like race or University policies.

## Source

This data is self generated, and directly derived from primary sources. I created it as part of my undergraduate BA thesis in Geography. The data was mined from digitized historic documents contained in [Campus Publications](https://campub.lib.uchicago.edu/), the University of Chicago's online archive of its community oriented publications.

The documents contained in Campus Publications were originally printed. However, now that they have been digitized, they are key-word searchable. I decided to take advantage of this functionality, by writing a script that would loop through every street address on a "South" or "East" labeled street (ie 1005 E 60th Street, or 5900 South Ellis Ave) and keyword search them in Campus Publications. These addresses were themselves taken from the Chicago Open Data Portal, which maintains a [document](https://data.cityofchicago.org/Transportation/Chicago-Street-Names/i6bp-fvbx/data) with the name of every street in Chicago and their address number ranges. In all, given the multiple permutations of each address (1005 E 60th, 1005 East 60th Street, etc.) my script made over 5 million keyword searches. The effort was such that I was allowed to run the script on the Midway2 federated supercomputer.

## Interest

Why you are interested in this topic
Thoughts on how you would hope to use this data



Potential data points
Any concerns about the data

## Supplemental Data

I intend to supplement my street address data with historic census data (most of all on race) taken from [IPUMS NHGIS](https://www.nhgis.org/).

