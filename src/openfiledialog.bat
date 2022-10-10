@echo off
setlocal

:: Define o encoding para UTF-8
chcp 65001 >nul 2>&1

set "ps=Add-Type -AssemblyName System.windows.forms | Out-Null;"
set "ps=%ps% $f=New-Object System.Windows.Forms.OpenFileDialog;"
set "ps=%ps% $f.Filter='Image Files (*.jpg, *.jpeg, *.png)|*.jpg;*.jpeg;*.png|All files (*.*)|*.*';"
set "ps=%ps% $f.Title='Selecione um arquivo';"
set "ps=%ps% $f.ShowDialog() | Out-Null;"
set "ps=%ps% $f.FileName"

for /f "delims=" %%I in ('powershell "%ps%"') do set "filename=%%I"

if defined filename (
    echo %filename%
) else (
    echo null
)

goto :EOF