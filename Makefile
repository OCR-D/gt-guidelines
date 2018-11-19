export

DITA_OT_VERSION  = 3.0.4
DITA_OT_DIR      = dita-ot-$(DITA_OT_VERSION)
DITA_OT_ZIP      = $(DITA_OT_DIR).zip
DITA_OT_URL = https://github.com/dita-ot/dita-ot/releases/download/$(DITA_OT_VERSION)/$(DITA_OT_ZIP)

PATH := $(PWD)/$(DITA_OT_DIR)/bin:$(PATH)
DITA = dita

TOPICMAP = $(PWD)/topicmap.tpl.xml

# Options passed to ant in dita script. Default: '$(ANT_OPTS)'
ANT_OPTS = "-Dhttp.proxySet=true" "-Dhttp.proxyHost=http-proxy.sbb.spk-berlin.de" "-Dhttps.proxyHost=http-proxy.sbb.spk-berlin.de" "-Dhttp.proxyPort=3128" "-Dhttps.proxyPort=3128"

# Folder containing GT guidelines. Default: '$(GT_DOC_DITAMAP)'
GT_DOC_DITAMAP = documentation/ocrd.ditamap

# Folder to put OUTPUT in. Default: '$(GT_DOC_OUT)'
GT_DOC_OUT = build/gt-guidelines

# BEGIN-EVAL makefile-parser --make-help Makefile

help:
	@echo ""
	@echo "  Targets"
	@echo ""
	@echo "    deps   Download DITA-OT dist"
	@echo "    build  Build docs from $(IN)/DOC.md to $(OUT)"
	@echo ""
	@echo "  Variables"
	@echo ""
	@echo "    ANT_OPTS        Options passed to ant in dita script. Default: '$(ANT_OPTS)'"
	@echo "    GT_DOC_DITAMAP  Folder containing GT guidelines. Default: '$(GT_DOC_DITAMAP)'"
	@echo "    GT_DOC_OUT      Folder to put OUTPUT in. Default: '$(GT_DOC_OUT)'"

# END-EVAL

# Download DITA-OT dist
deps: $(DITA_OT_DIR)

$(DITA_OT_DIR):
	wget "$(DITA_OT_URL)"
	unzip $(DITA_OT_ZIP)

# Build docs from $(IN)/DOC.md to $(OUT)
build:
	$(DITA) -o "$(GT_DOC_OUT)" -i "$(GT_DOC_DITAMAP)" -f html5
