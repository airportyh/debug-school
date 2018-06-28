#! /usr/bin/env node
'use strict'

const fs = require('fs-promise')
const co = require('co')
const yfm = require('yaml-front-matter')
const path = require('path')
const marked = require('marked')

function template(content, meta){
  return `
<!doctype html>
<html>
  <head>
    <title>${meta.title}</title>
    <link href="../../style.css" rel="stylesheet">
  </head>
  <body>
    <div id="site-header">
      <div class="title">
        <a href="../../index.html">Debug School</a>
      </div>
    </div>
    <div id="content">
      <h1>${meta.title}</h1>
      ${content}
      <a class="button" href="${meta.url}">Watch Now</a>
      <a class="button" href="homework.html">Do the Homework</a>
    </div>
  </body>
</html>
`
}

co(function *() {
  let lessonDirs = yield fs.readdir('lessons')
  for (let lessonDir of lessonDirs) {
    let indexFilePath = path.join('lessons', lessonDir, 'index.md')
    let homeworkFilePath = path.join('lessons', lessonDir, 'homework.md')
    let meta = yfm.loadFront(yield fs.readFile(indexFilePath))
    let homework = (yield fs.readFile(homeworkFilePath)).toString()
    console.log(`generating ${lessonDir}/index.html`)
    let lessonHtml = template(marked(meta.__content), meta)
    let homeworkHtml = template(marked('## (Homework)\n' + homework), meta)
    yield fs.writeFile(`lessons/${lessonDir}/index.html`, lessonHtml)
    console.log(`Wrote lessons/${lessonDir}/index.html`)
    yield fs.writeFile(`lessons/${lessonDir}/homework.html`, homeworkHtml)
    console.log(`Wrote lessons/${lessonDir}/homework.html`)
    // let shortHtml = ${marked(meta.short || '')

  }
  process.exit(0)
}).catch(function(err) {
  console.error(err.message)
})
