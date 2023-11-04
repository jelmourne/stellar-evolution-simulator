import mesa_web as mesa
import pandas as pd

# Absolute file path of data file extracted from MESA
filePath = r"C:\Users\Tristan\Desktop\trimmed_history.data"

# Using pandas to extract the data into a DataFrame for data manipulation
result = pd.DataFrame(mesa.read_history(filePath))

starData = result[['model_number', 'star_age', 'star_mass', 'log_L', 'log_R', 'log_Teff', 'log_center_Rho', 'log_center_P', 'center_h1', 'center_he3', 'center_he4', 'star_mdot']].copy()
starData.to_csv('data.csv', index=False)

