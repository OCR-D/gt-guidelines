export

# Repository containing the DITA sources. Default: $(REPODIR)
REPODIR = $(PWD)

DITA_OT_VERSION  = 3.4
DITA_OT_DIR      = $(REPODIR)dita-ot-$(DITA_OT_VERSION)
DITA_OT_ZIP      = $(DITA_OT_DIR).zip
DITA_OT_URL = https://github.com/dita-ot/dita-ot/releases/download/$(DITA_OT_VERSION)/$(DITA_OT_ZIP)

# Options passed to dita, e..g -d. Default: '$(DITA_OPTS)'
DITA_OPTS =

# Options passed to ant in dita script. Default: '$(ANT_OPTS)'
ANT_OPTS = "-Dhttp.proxySet=true" "-Dhttp.proxyHost=http-proxy.sbb.spk-berlin.de" "-Dhttps.proxyHost=http-proxy.sbb.spk-berlin.de" "-Dhttp.proxyPort=3128" "-Dhttps.proxyPort=3128"

# Absolute path to ditamap. Default: '$(GT_DOC_DITAMAP)'
GT_DOC_DITAMAP = $(REPODIR)/ocrd_ocrd.ditamap

# Folder to put OUTPUT in. Default: '$(GT_DOC_OUT)'
GT_DOC_OUT = $(CURDIR)/output

# BEGIN-EVAL makefile-parser --make-help Makefile

help:
	@echo ""
	@echo "  Targets"
	@echo ""
	@echo "    deps      Download DITA-OT dist"
	@echo "    markdown  Build Markdown"
	@echo "    build     Build HTML"
	@echo ""
	@echo "  Variables"
	@echo ""
	@echo "    DITA_OPTS       Options passed to dita, e..g -d. Default: '$(DITA_OPTS)'"
	@echo "    ANT_OPTS        Options passed to ant in dita script. Default: '$(ANT_OPTS)'"
	@echo "    GT_DOC_DITAMAP  Absolute path to ditamap. Default: '$(GT_DOC_DITAMAP)'"
	@echo "    GT_DOC_OUT      Folder to put OUTPUT in. Default: '$(GT_DOC_OUT)'"
	@echo "    REPODIR         Repository containing the DITA sources. Default: $(REPODIR)"

# END-EVAL

# Download DITA-OT dist
deps: $(DITA_OT_DIR)

$(DITA_OT_DIR):
	wget "$(DITA_OT_URL)"
	unzip $(DITA_OT_ZIP)
	sed -i 's/About this task/About this Task/' $(DITA_OT_DIR)/plugins/org.dita.base/xsl/common/*.xml

# Build Markdown
markdown:
	cd $(DITA_OT_DIR); ./bin/dita $(DITA_OPTS) \
		--input="$(GT_DOC_DITAMAP)" \
		--output="$(GT_DOC_OUT)" \
		--format=markdown_github \
		--args.input.dir="$(REPODIR)" \
	cp -r $(REPODIR)/resources/ $(GT_DOC_OUT)

# Build HTML
build:
	cd $(DITA_OT_DIR); ./bin/dita $(DITA_OPTS) \
		--input="$(GT_DOC_DITAMAP)" \
		--output="$(GT_DOC_OUT)" \
		--format=html5 \
		--args.input.dir="$(REPODIR)" \
		--propertyfile="$(REPODIR)/properties/docs-build-html5_ocrd.properties"
	cp -r $(REPODIR)/resources/ $(GT_DOC_OUT)
	cp $(REPODIR)/redirecting-index.html $(GT_DOC_OUT)/index.html
