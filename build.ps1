# # Build Script for the blog

# Running the subproject build scripts
cd ..\admin
npm run build
cd ..\frontend
npm run build
cd ..\backend

# Stupid workaround for Powershell issues
rm -Recurse -Force .\admin\ | Out-Null
rm -Recurse -Force .\admin\ | Out-Null
rm -Recurse -Force .\frontend\ | Out-Null
rm -Recurse -Force .\frontend\ | Out-Null

# Copying everything to the backend folder
cp ..\admin\build\ .\admin\ -Recurse
cp ..\frontend\dist\ .\frontend\ -Recurse