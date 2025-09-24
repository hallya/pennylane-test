#!/usr/bin/env node

const { execSync } = require('child_process')
const { Project } = require('ts-morph')

function getModifiedFiles() {
  try {
    const output = execSync('git diff --cached --name-only', {
      encoding: 'utf-8',
    })
    return output
      .trim()
      .split('\n')
      .filter((file) => file.endsWith('.ts') || file.endsWith('.tsx'))
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des fichiers modifiés:',
      error.message
    )
    return []
  }
}

function findDependents(project, filePath) {
  const sourceFile = project.getSourceFile(filePath)
  if (!sourceFile) return []

  const dependents = []
  const allFiles = project.getSourceFiles()
  const absoluteFilePath = sourceFile.getFilePath()
  const modifiedDir = absoluteFilePath.substring(
    0,
    absoluteFilePath.lastIndexOf('/')
  )

  allFiles.forEach((file) => {
    if (file.getFilePath() === filePath) return

    const imports = file.getImportDeclarations()
    const hasImport = imports.some((imp) => {
      const resolved = imp.getModuleSpecifierSourceFile()
      if (!resolved) return false

      const resolvedPath = resolved.getFilePath()
      if (resolvedPath === absoluteFilePath) return true

      if (
        resolvedPath.endsWith('/index.ts') ||
        resolvedPath.endsWith('/index.tsx')
      ) {
        const resolvedDir = resolvedPath.substring(
          0,
          resolvedPath.lastIndexOf('/')
        )
        if (resolvedDir === modifiedDir) return true
      }

      return false
    })

    if (hasImport) {
      dependents.push(file.getFilePath())
    }
  })

  return dependents
}

function main() {
  const project = new Project({
    tsConfigFilePath: 'tsconfig.json',
  })

  const modifiedFiles = getModifiedFiles()
  console.log('Fichiers modifiés:', modifiedFiles)

  let allRelatedFiles = [...modifiedFiles]
  let toProcess = [...modifiedFiles]

  while (toProcess.length > 0) {
    const file = toProcess.shift()
    const dependents = findDependents(project, file)
    console.log(`Dépendants de ${file}:`, dependents)
    dependents.forEach((dep) => {
      if (!allRelatedFiles.includes(dep)) {
        allRelatedFiles.push(dep)
        toProcess.push(dep)
      }
    })
  }

  allRelatedFiles = [...new Set(allRelatedFiles)]

  // Convert to relative paths
  const cwd = process.cwd()
  const relativeFiles = allRelatedFiles.map((file) =>
    file.startsWith(cwd) ? file.substring(cwd.length + 1) : file
  )

  console.log('Fichiers liés:', relativeFiles.join(' '))
}

main()
