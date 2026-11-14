# CMIP6 source data and attribution

All plotted data is calculated from the public CMIP6 Google Cloud fields accessed by the assignment-provided notebook. No external temperature-summary archive is used.

## Approved access route

- Assignment-linked dataset: https://console.cloud.google.com/marketplace/product/noaa-public/cmip6
- Course notebook: https://github.com/dsc-courses/dsc106-2025-fa/blob/main/lectures/climate-lecture/CMIP%20basic_search_and_load-colab.ipynb
- The exact catalog read by that notebook: https://storage.googleapis.com/cmip6/cmip6-zarr-consolidated-stores.csv

## Retained simulations

The same nine models are retained in all five SSPs. For each model, one ensemble member is matched across historical and future runs. The selected catalog rows pin model, member, grid, variable, version, and original cloud-store path. Static area fields may come from another experiment of the same model and matching grid; no temperature from that experiment is used.

| Model | Institution | Member | Grid | Source dataset information | Source license |
|---|---|---|---|---|---|
| CNRM-ESM2-1 | CNRM-CERFACS | r1i1p1f2 | gr | [Dataset record](https://furtherinfo.es-doc.org/CMIP6.CNRM-CERFACS.CNRM-ESM2-1.historical.none.r1i1p1f2) | [CC BY-NC-SA 4.0](#cnrm-esm2-1) |
| CanESM5 | CCCma | r1i1p1f1 | gn | [Dataset record](https://furtherinfo.es-doc.org/CMIP6.CCCma.CanESM5.historical.none.r1i1p1f1) | [CC BY-SA 4.0](#canesm5) |
| EC-Earth3-Veg-LR | EC-Earth-Consortium | r1i1p1f1 | gr | [Dataset record](https://furtherinfo.es-doc.org/CMIP6.EC-Earth-Consortium.EC-Earth3-Veg-LR.historical.none.r1i1p1f1) | [CC BY-SA 4.0](#ec-earth3-veg-lr) |
| GFDL-ESM4 | NOAA-GFDL | r1i1p1f1 | gr1 | [Dataset record](https://furtherinfo.es-doc.org/CMIP6.NOAA-GFDL.GFDL-ESM4.historical.none.r1i1p1f1) | [CC BY-SA 4.0](#gfdl-esm4) |
| GISS-E2-1-G | NASA-GISS | r1i1p3f1 | gn | [Dataset record](https://furtherinfo.es-doc.org/CMIP6.NASA-GISS.GISS-E2-1-G.historical.none.r1i1p3f1) | [CC BY-SA 4.0](#giss-e2-1-g) |
| IPSL-CM6A-LR | IPSL | r1i1p1f1 | gr | [Dataset record](https://furtherinfo.es-doc.org/CMIP6.IPSL.IPSL-CM6A-LR.historical.none.r1i1p1f1) | [CC BY-NC-SA 4.0](#ipsl-cm6a-lr) |
| MIROC-ES2L | MIROC | r1i1p1f2 | gn | [Dataset record](https://furtherinfo.es-doc.org/CMIP6.MIROC.MIROC-ES2L.historical.none.r1i1p1f2) | [CC BY-SA 4.0](#miroc-es2l) |
| MRI-ESM2-0 | MRI | r1i1p1f1 | gn | [Dataset record](https://furtherinfo.es-doc.org/CMIP6.MRI.MRI-ESM2-0.historical.none.r1i1p1f1) | [CC BY-SA 4.0](#mri-esm2-0) |
| UKESM1-0-LL | MOHC | r1i1p1f2 | gn | [Dataset record](https://furtherinfo.es-doc.org/CMIP6.MOHC.UKESM1-0-LL.historical.none.r1i1p1f2) | [CC BY-SA 4.0](#ukesm1-0-ll) |

The source records and original model-specific license declarations are included below. The visualization data is a derived product: spatial and temporal averaging and subtraction of historical baselines were performed as described here; the original modeling institutions did not produce this website.

## Derivation

1. Compute global monthly near-surface air temperature (`tas`, Kelvin) from every grid cell, weighted by matching supplied `areacella` values. Missing cells, if any, receive no weight; no values are fabricated. Coordinate-label discrepancies no greater than 1e-10 degrees are normalized without resampling.
2. Weight monthly global means by calendar days to obtain annual means, respecting each model calendar.
3. For each matching model/member, subtract its historical 1850–1900 mean (51 equally weighted annual means). Kelvin differences equal Celsius differences.
4. Join historical 2011–2014 values with scenario 2015–2100 values and average into nine disjoint ten-year periods.
5. Compute the median and R-7 10th/90th percentiles across the same nine models for each pathway and decade.

Selection is based on historical/all-five-SSP coverage, a consistent member/grid, supplied cell areas, complete years, and a manageable grid (at most 60,000 cells), with one lower-resolution model per institution. No model is selected or discarded based on its warming outcome. This is a limited educational subset, not an assessed or comprehensive CMIP6 ensemble.

## Original source records and license declarations

### CNRM-ESM2-1

Institution: CNRM-CERFACS. Member: `r1i1p1f2`. Grid: `gr`.

Original source license declaration:

> CMIP6 model data produced by CNRM-CERFACS is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (https://creativecommons.org/licenses). Consult https://pcmdi.llnl.gov/CMIP6/TermsOfUse for terms of use governing CMIP6 output, including citation requirements and proper acknowledgment. Further information about this data, including some limitations, can be found via the further_info_url (recorded as a global attribute in this file) and at http://www.umr-cnrm.fr/cmip6/. The data producers and data providers make no warranty, either express or implied, including, but not limited to, warranties of merchantability and fitness for a particular purpose. All liabilities arising from the supply of the information (including any liability arising in negligence) are excluded to the fullest extent permitted by law.

Source references:

http://www.umr-cnrm.fr/cmip6/references

Exact CMIP6 cloud stores used:

- `gs://cmip6/CMIP6/CMIP/CNRM-CERFACS/CNRM-ESM2-1/historical/r1i1p1f2/Amon/tas/gr/v20181206/`
- `gs://cmip6/CMIP6/ScenarioMIP/CNRM-CERFACS/CNRM-ESM2-1/ssp119/r1i1p1f2/Amon/tas/gr/v20190328/`
- `gs://cmip6/CMIP6/ScenarioMIP/CNRM-CERFACS/CNRM-ESM2-1/ssp126/r1i1p1f2/Amon/tas/gr/v20190328/`
- `gs://cmip6/CMIP6/ScenarioMIP/CNRM-CERFACS/CNRM-ESM2-1/ssp245/r1i1p1f2/Amon/tas/gr/v20190328/`
- `gs://cmip6/CMIP6/ScenarioMIP/CNRM-CERFACS/CNRM-ESM2-1/ssp370/r1i1p1f2/Amon/tas/gr/v20191021/`
- `gs://cmip6/CMIP6/ScenarioMIP/CNRM-CERFACS/CNRM-ESM2-1/ssp585/r1i1p1f2/Amon/tas/gr/v20191021/`
- `gs://cmip6/CMIP6/ScenarioMIP/CNRM-CERFACS/CNRM-ESM2-1/ssp370/r1i1p1f2/fx/areacella/gr/v20191021/`

### CanESM5

Institution: CCCma. Member: `r1i1p1f1`. Grid: `gn`.

Original source license declaration:

> CMIP6 model data produced by The Government of Canada (Canadian Centre for Climate Modelling and Analysis, Environment and Climate Change Canada) is licensed under a Creative Commons Attribution ShareAlike 4.0 International License (https://creativecommons.org/licenses). Consult https://pcmdi.llnl.gov/CMIP6/TermsOfUse for terms of use governing CMIP6 output, including citation requirements and proper acknowledgment. Further information about this data, including some limitations, can be found via the further_info_url (recorded as a global attribute in this file) and at https:///pcmdi.llnl.gov/. The data producers and data providers make no warranty, either express or implied, including, but not limited to, warranties of merchantability and fitness for a particular purpose. All liabilities arising from the supply of the information (including any liability arising in negligence) are excluded to the fullest extent permitted by law.

Source references:

Geophysical Model Development Special issue on CanESM5 (https://www.geosci-model-dev.net/special_issues.html)

Exact CMIP6 cloud stores used:

- `gs://cmip6/CMIP6/CMIP/CCCma/CanESM5/historical/r1i1p1f1/Amon/tas/gn/v20190429/`
- `gs://cmip6/CMIP6/ScenarioMIP/CCCma/CanESM5/ssp119/r1i1p1f1/Amon/tas/gn/v20190429/`
- `gs://cmip6/CMIP6/ScenarioMIP/CCCma/CanESM5/ssp126/r1i1p1f1/Amon/tas/gn/v20190429/`
- `gs://cmip6/CMIP6/ScenarioMIP/CCCma/CanESM5/ssp245/r1i1p1f1/Amon/tas/gn/v20190429/`
- `gs://cmip6/CMIP6/ScenarioMIP/CCCma/CanESM5/ssp370/r1i1p1f1/Amon/tas/gn/v20190429/`
- `gs://cmip6/CMIP6/ScenarioMIP/CCCma/CanESM5/ssp585/r1i1p1f1/Amon/tas/gn/v20190429/`
- `gs://cmip6/CMIP6/CMIP/CCCma/CanESM5/historical/r1i1p1f1/fx/areacella/gn/v20190429/`

### EC-Earth3-Veg-LR

Institution: EC-Earth-Consortium. Member: `r1i1p1f1`. Grid: `gr`.

Original source license declaration:

> CMIP6 model data produced by EC-Earth-Consortium is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License (https://creativecommons.org/licenses). Consult https://pcmdi.llnl.gov/CMIP6/TermsOfUse for terms of use governing CMIP6 output, including citation requirements and proper acknowledgment. Further information about this data, including some limitations, can be found via the further_info_url (recorded as a global attribute in this file) and at http://www.ec-earth.org. The data producers and data providers make no warranty, either express or implied, including, but not limited to, warranties of merchantability and fitness for a particular purpose. All liabilities arising from the supply of the information (including any liability arising in negligence) are excluded to the fullest extent permitted by law.

Exact CMIP6 cloud stores used:

- `gs://cmip6/CMIP6/CMIP/EC-Earth-Consortium/EC-Earth3-Veg-LR/historical/r1i1p1f1/Amon/tas/gr/v20200217/`
- `gs://cmip6/CMIP6/ScenarioMIP/EC-Earth-Consortium/EC-Earth3-Veg-LR/ssp119/r1i1p1f1/Amon/tas/gr/v20201201/`
- `gs://cmip6/CMIP6/ScenarioMIP/EC-Earth-Consortium/EC-Earth3-Veg-LR/ssp126/r1i1p1f1/Amon/tas/gr/v20201201/`
- `gs://cmip6/CMIP6/ScenarioMIP/EC-Earth-Consortium/EC-Earth3-Veg-LR/ssp245/r1i1p1f1/Amon/tas/gr/v20201123/`
- `gs://cmip6/CMIP6/ScenarioMIP/EC-Earth-Consortium/EC-Earth3-Veg-LR/ssp370/r1i1p1f1/Amon/tas/gr/v20201123/`
- `gs://cmip6/CMIP6/ScenarioMIP/EC-Earth-Consortium/EC-Earth3-Veg-LR/ssp585/r1i1p1f1/Amon/tas/gr/v20201201/`
- `gs://cmip6/CMIP6/CMIP/EC-Earth-Consortium/EC-Earth3-Veg-LR/historical/r1i1p1f1/fx/areacella/gr/v20200217/`

### GFDL-ESM4

Institution: NOAA-GFDL. Member: `r1i1p1f1`. Grid: `gr1`.

Original source license declaration:

> CMIP6 model data produced by NOAA-GFDL is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License (https://creativecommons.org/licenses/). Consult https://pcmdi.llnl.gov/CMIP6/TermsOfUse for terms of use governing CMIP6 output, including citation requirements and proper acknowledgment. Further information about this data, including some limitations, can be found via the further_info_url (recorded as a global attribute in this file). The data producers and data providers make no warranty, either express or implied, including, but not limited to, warranties of merchantability and fitness for a particular purpose. All liabilities arising from the supply of the information (including any liability arising in negligence) are excluded to the fullest extent permitted by law.

Source references:

see further_info_url attribute

Exact CMIP6 cloud stores used:

- `gs://cmip6/CMIP6/CMIP/NOAA-GFDL/GFDL-ESM4/historical/r1i1p1f1/Amon/tas/gr1/v20190726/`
- `gs://cmip6/CMIP6/ScenarioMIP/NOAA-GFDL/GFDL-ESM4/ssp119/r1i1p1f1/Amon/tas/gr1/v20180701/`
- `gs://cmip6/CMIP6/ScenarioMIP/NOAA-GFDL/GFDL-ESM4/ssp126/r1i1p1f1/Amon/tas/gr1/v20180701/`
- `gs://cmip6/CMIP6/ScenarioMIP/NOAA-GFDL/GFDL-ESM4/ssp245/r1i1p1f1/Amon/tas/gr1/v20180701/`
- `gs://cmip6/CMIP6/ScenarioMIP/NOAA-GFDL/GFDL-ESM4/ssp370/r1i1p1f1/Amon/tas/gr1/v20180701/`
- `gs://cmip6/CMIP6/ScenarioMIP/NOAA-GFDL/GFDL-ESM4/ssp585/r1i1p1f1/Amon/tas/gr1/v20180701/`
- `gs://cmip6/CMIP6/CMIP/NOAA-GFDL/GFDL-ESM4/historical/r1i1p1f1/fx/areacella/gr1/v20190726/`

### GISS-E2-1-G

Institution: NASA-GISS. Member: `r1i1p3f1`. Grid: `gn`.

Original source license declaration:

> CMIP6 model data produced by NASA Goddard Institute for Space Studies is licensed under a Creative Commons Attribution ShareAlike 4.0 International License (https://creativecommons.org/licenses). Consult https://pcmdi.llnl.gov/CMIP6/TermsOfUse for terms of use governing CMIP6 output, including citation requirements and proper acknowledgment. Further information about this data, including some limitations, can be found via the further_info_url (recorded as a global attribute in this file) and at https:///pcmdi.llnl.gov/. The data producers and data providers make no warranty, either express or implied, including, but not limited to, warranties of merchantability and fitness for a particular purpose. All liabilities arising from the supply of the information (including any liability arising in negligence) are excluded to the fullest extent permitted by law.

Source references:

https://data.giss.nasa.gov/modelE/cmip6

Exact CMIP6 cloud stores used:

- `gs://cmip6/CMIP6/CMIP/NASA-GISS/GISS-E2-1-G/historical/r1i1p3f1/Amon/tas/gn/v20190702/`
- `gs://cmip6/CMIP6/ScenarioMIP/NASA-GISS/GISS-E2-1-G/ssp119/r1i1p3f1/Amon/tas/gn/v20200115/`
- `gs://cmip6/CMIP6/ScenarioMIP/NASA-GISS/GISS-E2-1-G/ssp126/r1i1p3f1/Amon/tas/gn/v20200115/`
- `gs://cmip6/CMIP6/ScenarioMIP/NASA-GISS/GISS-E2-1-G/ssp245/r1i1p3f1/Amon/tas/gn/v20200115/`
- `gs://cmip6/CMIP6/ScenarioMIP/NASA-GISS/GISS-E2-1-G/ssp370/r1i1p3f1/Amon/tas/gn/v20200115/`
- `gs://cmip6/CMIP6/ScenarioMIP/NASA-GISS/GISS-E2-1-G/ssp585/r1i1p3f1/Amon/tas/gn/v20200115/`
- `gs://cmip6/CMIP6/CMIP/NASA-GISS/GISS-E2-1-G/piControl/r1i1p3f1/fx/areacella/gn/v20180824/`

### IPSL-CM6A-LR

Institution: IPSL. Member: `r1i1p1f1`. Grid: `gr`.

Original source license declaration:

> CMIP6 model data produced by IPSL is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (https://creativecommons.org/licenses). Consult https://pcmdi.llnl.gov/CMIP6/TermsOfUse for terms of use governing CMIP6 output, including citation requirements and proper acknowledgment. Further information about this data, including some limitations, can be found via the further_info_url (recorded as a global attribute in this file) and at https://cmc.ipsl.fr/. The data producers and data providers make no warranty, either express or implied, including, but not limited to, warranties of merchantability and fitness for a particular purpose. All liabilities arising from the supply of the information (including any liability arising in negligence) are excluded to the fullest extent permitted by law.

Exact CMIP6 cloud stores used:

- `gs://cmip6/CMIP6/CMIP/IPSL/IPSL-CM6A-LR/historical/r1i1p1f1/Amon/tas/gr/v20180803/`
- `gs://cmip6/CMIP6/ScenarioMIP/IPSL/IPSL-CM6A-LR/ssp119/r1i1p1f1/Amon/tas/gr/v20190410/`
- `gs://cmip6/CMIP6/ScenarioMIP/IPSL/IPSL-CM6A-LR/ssp126/r1i1p1f1/Amon/tas/gr/v20190903/`
- `gs://cmip6/CMIP6/ScenarioMIP/IPSL/IPSL-CM6A-LR/ssp245/r1i1p1f1/Amon/tas/gr/v20190119/`
- `gs://cmip6/CMIP6/ScenarioMIP/IPSL/IPSL-CM6A-LR/ssp370/r1i1p1f1/Amon/tas/gr/v20190119/`
- `gs://cmip6/CMIP6/ScenarioMIP/IPSL/IPSL-CM6A-LR/ssp585/r1i1p1f1/Amon/tas/gr/v20190903/`
- `gs://cmip6/CMIP6/CMIP/IPSL/IPSL-CM6A-LR/historical/r1i1p1f1/fx/areacella/gr/v20180803/`

### MIROC-ES2L

Institution: MIROC. Member: `r1i1p1f2`. Grid: `gn`.

Original source license declaration:

> CMIP6 model data produced by MIROC is licensed under a Creative Commons Attribution ShareAlike 4.0 International License (https://creativecommons.org/licenses/). Consult https://pcmdi.llnl.gov/CMIP6/TermsOfUse for terms of use governing CMIP6 output, including citation requirements and proper acknowledgment. Further information about this data, including some limitations, can be found via the further_info_url (recorded as a global attribute in this file). The data producers and data providers make no warranty, either express or implied, including, but not limited to, warranties of merchantability and fitness for a particular purpose. All liabilities arising from the supply of the information (including any liability arising in negligence) are excluded to the fullest extent permitted by law.

Exact CMIP6 cloud stores used:

- `gs://cmip6/CMIP6/CMIP/MIROC/MIROC-ES2L/historical/r1i1p1f2/Amon/tas/gn/v20190823/`
- `gs://cmip6/CMIP6/ScenarioMIP/MIROC/MIROC-ES2L/ssp119/r1i1p1f2/Amon/tas/gn/v20190823/`
- `gs://cmip6/CMIP6/ScenarioMIP/MIROC/MIROC-ES2L/ssp126/r1i1p1f2/Amon/tas/gn/v20190823/`
- `gs://cmip6/CMIP6/ScenarioMIP/MIROC/MIROC-ES2L/ssp245/r1i1p1f2/Amon/tas/gn/v20190823/`
- `gs://cmip6/CMIP6/ScenarioMIP/MIROC/MIROC-ES2L/ssp370/r1i1p1f2/Amon/tas/gn/v20190823/`
- `gs://cmip6/CMIP6/ScenarioMIP/MIROC/MIROC-ES2L/ssp585/r1i1p1f2/Amon/tas/gn/v20190823/`
- `gs://cmip6/CMIP6/CMIP/MIROC/MIROC-ES2L/historical/r1i1p1f2/fx/areacella/gn/v20190823/`

### MRI-ESM2-0

Institution: MRI. Member: `r1i1p1f1`. Grid: `gn`.

Original source license declaration:

> CMIP6 model data produced by MRI is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License (https://creativecommons.org/licenses/). Consult https://pcmdi.llnl.gov/CMIP6/TermsOfUse for terms of use governing CMIP6 output, including citation requirements and proper acknowledgment. Further information about this data, including some limitations, can be found via the further_info_url (recorded as a global attribute in this file). The data producers and data providers make no warranty, either express or implied, including, but not limited to, warranties of merchantability and fitness for a particular purpose. All liabilities arising from the supply of the information (including any liability arising in negligence) are excluded to the fullest extent permitted by law.

Exact CMIP6 cloud stores used:

- `gs://cmip6/CMIP6/CMIP/MRI/MRI-ESM2-0/historical/r1i1p1f1/Amon/tas/gn/v20190222/`
- `gs://cmip6/CMIP6/ScenarioMIP/MRI/MRI-ESM2-0/ssp119/r1i1p1f1/Amon/tas/gn/v20190222/`
- `gs://cmip6/CMIP6/ScenarioMIP/MRI/MRI-ESM2-0/ssp126/r1i1p1f1/Amon/tas/gn/v20191108/`
- `gs://cmip6/CMIP6/ScenarioMIP/MRI/MRI-ESM2-0/ssp245/r1i1p1f1/Amon/tas/gn/v20190222/`
- `gs://cmip6/CMIP6/ScenarioMIP/MRI/MRI-ESM2-0/ssp370/r1i1p1f1/Amon/tas/gn/v20190222/`
- `gs://cmip6/CMIP6/ScenarioMIP/MRI/MRI-ESM2-0/ssp585/r1i1p1f1/Amon/tas/gn/v20191108/`
- `gs://cmip6/CMIP6/CMIP/MRI/MRI-ESM2-0/historical/r1i1p1f1/fx/areacella/gn/v20190603/`

### UKESM1-0-LL

Institution: MOHC. Member: `r1i1p1f2`. Grid: `gn`.

Original source license declaration:

> CMIP6 model data produced by the Met Office Hadley Centre is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License (https://creativecommons.org/licenses). Consult https://pcmdi.llnl.gov/CMIP6/TermsOfUse for terms of use governing CMIP6 output, including citation requirements and proper acknowledgment. Further information about this data, including some limitations, can be found via the further_info_url (recorded as a global attribute in this file) and at https://ukesm.ac.uk/cmip6. The data producers and data providers make no warranty, either express or implied, including, but not limited to, warranties of merchantability and fitness for a particular purpose. All liabilities arising from the supply of the information (including any liability arising in negligence) are excluded to the fullest extent permitted by law.

Exact CMIP6 cloud stores used:

- `gs://cmip6/CMIP6/CMIP/MOHC/UKESM1-0-LL/historical/r1i1p1f2/Amon/tas/gn/v20190406/`
- `gs://cmip6/CMIP6/ScenarioMIP/MOHC/UKESM1-0-LL/ssp119/r1i1p1f2/Amon/tas/gn/v20190830/`
- `gs://cmip6/CMIP6/ScenarioMIP/MOHC/UKESM1-0-LL/ssp126/r1i1p1f2/Amon/tas/gn/v20190503/`
- `gs://cmip6/CMIP6/ScenarioMIP/MOHC/UKESM1-0-LL/ssp245/r1i1p1f2/Amon/tas/gn/v20190507/`
- `gs://cmip6/CMIP6/ScenarioMIP/MOHC/UKESM1-0-LL/ssp370/r1i1p1f2/Amon/tas/gn/v20190510/`
- `gs://cmip6/CMIP6/ScenarioMIP/MOHC/UKESM1-0-LL/ssp585/r1i1p1f2/Amon/tas/gn/v20190507/`
- `gs://cmip6/CMIP6/CMIP/MOHC/UKESM1-0-LL/piControl/r1i1p1f2/fx/areacella/gn/v20190705/`

We acknowledge WCRP, the nine CMIP6 modeling institutions, ESGF, the Google Cloud public CMIP6 archive, and the course authors for the linked access example.
