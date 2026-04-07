<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:math="http://www.w3.org/2005/xpath-functions/math"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:pc="http://schema.primaresearch.org/PAGE/gts/pagecontent/2019-07-15"
    xmlns:in="http://www.intern.de"
    exclude-result-prefixes="#all"
    version="3.0">
    <xsl:output indent="yes" omit-xml-declaration="yes" method="xml"/>
    
    
    <xsl:variable name="filename" select="document-uri(.)"/>
    
    <xsl:variable name="path">../ocrd-website.wiki</xsl:variable>
    <xsl:variable name="coll"><xsl:value-of select="$path"/>/?select=GT-Guide*.md;recurse=no</xsl:variable>
    <xsl:variable name="document-uri" select="document-uri(.)"/>
    
    
    <xsl:template match="chapter[@href='trans/fa.dita']">
        <xsl:element name="chapter">
            <xsl:attribute name="href">trans/fa.dita</xsl:attribute>
            <xsl:attribute name="class">- map/topicref bookmap/chapter </xsl:attribute>
            <xsl:for-each select="uri-collection($coll)">
                <xsl:sort/>
                <xsl:variable name="file" select="substring-after(iri-to-uri(.), 'wiki')"/>
                <xsl:element name="topicref">
                    <xsl:attribute name="class">- map/topicref </xsl:attribute>
                    <xsl:attribute name="format">markdown</xsl:attribute>
                    <xsl:attribute name="href">ocrd-website.wiki<xsl:value-of select="$file"/></xsl:attribute>
                </xsl:element>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
 
    <xsl:template match="@*|node()">
        <xsl:copy><xsl:apply-templates select="@*|node()"/></xsl:copy>
    </xsl:template>
    
    
</xsl:stylesheet>
