export

# Language to build. Default: $(LANG)
LANG = en

# Repository containing the DITA sources. Default: $(REPODIR)
MAKEFILE_DIR := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
REPODIR := $(MAKEFILE_DIR)/$(LANG)

DITA_OT_VERSION  = 3.4
DITA_OT_DIR      = $(MAKEFILE_DIR)/dita-ot-$(DITA_OT_VERSION)
DITA_OT_URL = https://github.com/dita-ot/dita-ot/releases/download/$(DITA_OT_VERSION)/dita-ot-$(DITA_OT_VERSION).zip

DITA_PROPERTY_FILE = $(REPODIR)/properties/docs-build-html5_ocrd.properties

# Options passed to dita, e..g -d. Default: '$(DITA_OPTS)'
DITA_OPTS =

# Options passed to ant in dita script on harshly guarded firewall. Default: '$(ANT_OPTS)'
ifeq ($(shell hostname --ip-address), "10.46.3.57")
ANT_OPTS = "-Dhttp.proxySet=true" "-Dhttp.proxyHost=http-proxy.sbb.spk-berlin.de" "-Dhttps.proxyHost=http-proxy.sbb.spk-berlin.de" "-Dhttp.proxyPort=3128" "-Dhttps.proxyPort=3128"
endif # but thankfully it currently isn't ,😎🕶

# Absolute path to ditamap. Default: '$(GT_DOC_DITAMAP)'
GT_DOC_DITAMAP = $(REPODIR)/ocrd_ocrd.ditamap

# Folder to put OUTPUT in. Default: '$(GT_DOC_OUT)'
GT_DOC_OUT = $(CURDIR)/output/$(LANG)

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
	@echo "    LANG            Language to build. Default: $(LANG)"
	@echo "    REPODIR         Repository containing the DITA sources. Default: $(REPODIR)"
	@echo "    DITA_OPTS       Options passed to dita, e..g -d. Default: '$(DITA_OPTS)'"
	@echo "    ANT_OPTS        Options passed to ant in dita script on harshly guarded firewall. Default: '$(ANT_OPTS)'"
	@echo "    GT_DOC_DITAMAP  Absolute path to ditamap. Default: '$(GT_DOC_DITAMAP)'"
	@echo "    GT_DOC_OUT      Folder to put OUTPUT in. Default: '$(GT_DOC_OUT)'"

# END-EVAL

# Download DITA-OT dist
deps: $(DITA_OT_DIR)

$(DITA_OT_DIR):
	wget "$(DITA_OT_URL)"
	unzip $(DITA_OT_DIR).zip
	sed -i 's/About this task/About this Task/' $(DITA_OT_DIR)/plugins/org.dita.base/xsl/common/*.xml

# Build HTML
build:
	cd $(DITA_OT_DIR); ./bin/dita $(DITA_OPTS) \
		--input="$(GT_DOC_DITAMAP)" \
		--output="$(GT_DOC_OUT)" \
		--format=html5 \
		--args.input.dir="$(REPODIR)" \
		--propertyfile="$(DITA_PROPERTY_FILE)"
	cp -r $(REPODIR)/resources/ $(GT_DOC_OUT)
