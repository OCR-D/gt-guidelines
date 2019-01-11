# Steps

1. Install DITA Open Toolkit (see https://www.dita-ot.org/)
1. Produce the HTML5 output as follow:

# HTML 5 output
```
dita --input=ocrd_ocrd.ditamap \
     --format=html5 \
     --output=output\ocr-d_GTG \
     --args.input.dir=grtran
     --propertyfile=properties\docs-build-html5_ocrd.properties
```     
see *Building output using the dita command* https://www.dita-ot.org/dev/topics/build-using-dita-command.html     