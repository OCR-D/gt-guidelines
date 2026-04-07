<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="xs" version="3.0">
    <xsl:output method="text"/>
    
   
    <xsl:template match="topic">
        {"ruleset":[
        <xsl:apply-templates select="//tbody"/>
        ]}
    </xsl:template>
    
<xsl:template match="tbody">
    <xsl:for-each select="row[@product='ruleset']">
        {"rule": ["<xsl:value-of select="entry[2]/text()[normalize-space()]"/>","<xsl:value-of select="entry[3]/text()[normalize-space()]"/>","<xsl:value-of select="entry[4]/text()[normalize-space()]"/>"], "type": "level"}<xsl:if test="position()!=last()"><xsl:text>,</xsl:text></xsl:if>
    </xsl:for-each>
</xsl:template>
    
    
    
    
    
    <xsl:template match="title | thead | p | prodname"/>
    
</xsl:stylesheet>
