export

DITA_OT_VERSION  = 3.0.4
DITA_OT_DIR      = dita-ot-$(DITA_OT_VERSION)
DITA_OT_ZIP      = $(DITA_OT_DIR).zip
DITA_OT_URL = https://github.com/dita-ot/dita-ot/releases/download/$(DITA_OT_VERSION)/$(DITA_OT_ZIP)

PATH := $(PWD)/$(DITA_OT_DIR)/bin:$(PATH)

# Options passed to dita, e..g -d. Default: '$(DITA_OPTS)'
DITA_OPTS =

# Options passed to ant in dita script. Default: '$(ANT_OPTS)'
ANT_OPTS = "-Dhttp.proxySet=true" "-Dhttp.proxyHost=http-proxy.sbb.spk-berlin.de" "-Dhttps.proxyHost=http-proxy.sbb.spk-berlin.de" "-Dhttp.proxyPort=3128" "-Dhttps.proxyPort=3128"

# Absolute path to ditamap. Default: '$(GT_DOC_DITAMAP)'
GT_DOC_DITAMAP = $$repodir/ocrd_ocrd.ditamap

# Folder to put OUTPUT in. Default: '$(GT_DOC_OUT)'
GT_DOC_OUT = output

# BEGIN-EVAL makefile-parser --make-help Makefile

help:
	@echo ""
	@echo "  Targets"
	@echo ""
	@echo "    deps   Download DITA-OT dist"
	@echo "    build  Build HTML"
	@echo ""
	@echo "  Variables"
	@echo ""
	@echo "    DITA_OPTS       Options passed to dita, e..g -d. Default: '$(DITA_OPTS)'"
	@echo "    ANT_OPTS        Options passed to ant in dita script. Default: '$(ANT_OPTS)'"
	@echo "    GT_DOC_DITAMAP  Absolute path to ditamap. Default: '$(GT_DOC_DITAMAP)'"
	@echo "    GT_DOC_OUT      Folder to put OUTPUT in. Default: '$(GT_DOC_OUT)'"

# END-EVAL

# Download DITA-OT dist
deps: $(DITA_OT_DIR)

$(DITA_OT_DIR):
	wget "$(DITA_OT_URL)"
	unzip $(DITA_OT_ZIP)

# Build HTML
build:
	repodir=$(PWD); cd $(DITA_OT_DIR); ./bin/dita $(DITA_OPTS) \
		--input="$(GT_DOC_DITAMAP)" \
		--output="$(GT_DOC_OUT)" \
		--format=html5 \
		--args.input.dir="$$repodir" \
		--propertyfile="$$repodir/properties/docs-build-html5_ocrd.properties"
	cp -r resources/ $(GT_DOC_OUT)
	cp redirecting-index.html $(GT_DOC_OUT)/index.html
