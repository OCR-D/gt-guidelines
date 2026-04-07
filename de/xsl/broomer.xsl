<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:math="http://www.w3.org/2005/xpath-functions/math"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:pc="http://schema.primaresearch.org/PAGE/gts/pagecontent/2019-07-15"
    xmlns:ditaarch="http://dita.oasis-open.org/architecture/2005/"
    xmlns:in="http://www.intern.de" exclude-result-prefixes="#all" version="3.0">
    <xsl:output indent="yes" method="xml"
        />

    <xsl:template match="/">
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE topic
  PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd"&gt;</xsl:text>
        <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="@specializations| /processing-instruction('path2rootmap-uri')"/>
    
    <xsl:template match="@* | node()">
        <xsl:copy> 
            <xsl:apply-templates select="@*|node()"/> 
            </xsl:copy> 
    </xsl:template>

</xsl:stylesheet>
