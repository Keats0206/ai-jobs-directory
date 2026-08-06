#!/usr/bin/env node
/**
 * SEO/LLM Validation Test
 * Tests current state of artificialjobs.dev for search readiness
 * Run: node seo-test.mjs
 */

import https from 'https';
import { URL } from 'url';

const SITE = 'https://www.artificialjobs.dev';
const PAGES_TO_TEST = [
  { url: '/', name: 'Homepage' },
  { url: '/agents', name: 'Agents Hub' },
  { url: '/compare/ai-coding-agents', name: 'Agent Comparison' },
  { url: '/jobs/ai-engineer-1', name: 'Job Detail (sample)' },
  { url: '/salary/ai-engineer', name: 'Salary Page (if exists)' },
];

async function fetchPage(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(SITE + path);
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function testPage(path, name) {
  console.log(`\n📄 Testing: ${name} (${path})`);
  try {
    const html = await fetchPage(path);
    
    // Schema detection
    const schemas = (html.match(/"@type":/g) || []).length;
    console.log(`   ✓ Schema.org instances: ${schemas}`);
    
    // Meta tags
    const hasMetaDesc = html.includes('meta name="description"');
    console.log(`   ${hasMetaDesc ? '✓' : '✗'} Meta description: ${hasMetaDesc ? 'present' : 'missing'}`);
    
    // OG tags
    const hasOG = html.includes('property="og:');
    console.log(`   ${hasOG ? '✓' : '✗'} Open Graph: ${hasOG ? 'present' : 'missing'}`);
    
    // H1
    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    console.log(`   ${h1Match ? '✓' : '✗'} H1: ${h1Match ? h1Match[1] : 'missing'}`);
    
    // Links (internal)
    const links = (html.match(/<a href="\//g) || []).length;
    console.log(`   ℹ️  Internal links: ${links}`);
    
  } catch (err) {
    console.log(`   ✗ Error: ${err.message}`);
  }
}

async function runTests() {
  console.log('🔍 SEO VALIDATION TEST — artificialjobs.dev\n');
  console.log(`Target: ${SITE}`);
  console.log('Testing:', PAGES_TO_TEST.map(p => p.name).join(', '));
  
  for (const { url, name } of PAGES_TO_TEST) {
    await testPage(url, name);
  }
  
  console.log('\n✅ Test complete. Results above.\n');
  console.log('Next: Implement schema additions from SEO_OPTIMIZATION_PLAN.md');
}

runTests();
