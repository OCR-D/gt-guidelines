# Steps
1. Use the Makefile for download and install the DITA Open Toolkit.
2. Use the Makefile to produce the HTML output.<br/>


# Download and install the DITA Open Toolkit 
```
make deps
```

# HTML 5 output for English
```
make build
```

# HTML 5 output for German
```
make LANG=de build
```


# HTML 5 output without makefile
```
dita --input=ocrd_ocrd.ditamap \
     --format=html5 \
     --output=output\ocr-d_GTG \
     --args.input.dir=grtran
     --propertyfile=properties\docs-build-html5_ocrd.properties
```     
see *Building output using the dita command* https://www.dita-ot.org/dev/topics/build-using-dita-command.html     
