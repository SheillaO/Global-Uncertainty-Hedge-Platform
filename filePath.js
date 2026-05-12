import path from 'node:path'

export function filePath(__dirname){


    const relPathToResource = path. join ('public', 'index.html')

    console.log('filePath:', relPathToResource)
}