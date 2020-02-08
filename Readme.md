# Steps

1. Download the DITA Open Toolkit (see https://www.dita-ot.org/)
2. Install the DITA Open Toolkit into the documentation on the same level as the directories ``en`` and ``de``.
3. Use the Makefile to produce the HTML output.<br/>
***Note: You must change the rights for the program **dita** maybe. For UNIX systems: ``chmod +x dita``.***

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
