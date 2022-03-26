#!/usr/bin/env node
"use strict";

const dirname = require(`path`).dirname
const join = require(`path`).join
const normalize = require(`path`).normalize
const existsSync = require(`fs`).existsSync
const readFileSync = require(`fs`).readFileSync
const fs = require("fs");

const Module = require(`module`)
var include = Module.prototype.require

Module.prototype.require = function(path) {
    let safeloaderJS = Safeloader.getInstance(path);
    var dir = path
    if(!safeloaderJS.isModuleAndIsExist(path)){
        path = `${path}.js`;
    }
    if (path[0] === `.`) return include.call(this, path);
    if (path[0] === `/`) dir = safeloaderJS.getRootPth(path) || path;
    if (path[0] === `@`) {dir = safeloaderJS.setShortcutsPath(path) || path;}
    if (safeloaderJS.isFileAndIsExist(path)[0] && safeloaderJS.isFileAndIsExist(path)[1]) { return safeloaderJS.GetTheFileData(path);}
    if (path === `safeloaderjs`) return safeloaderJS.getPaths();
    return include.call(this, dir)
  }

class PrivateSafeloader {

    constructor(path) {
      this.getPaths(path);
    }
    #path = "";
    getPaths(path) {
        this.#path = path || this.getCallerPath();
        return this.setShortcut(this.#path);
      }
    getCallerPath(){
        let error = new Error();
        let regex = /at require \(internal\/module\.js:11:18\)\n.+\((.*):\d+:\d+\)/m;
        if(!error.stack.match(regex)){
            regex =  /at Object\.<anonymous> \((.+):\d+:\d+\)/m;
        }
        return error.stack.match(regex)[1];
    }
    #shortcutMatchs = {};
    setShortcutsPath(path){
        let getRoot = this.#getRoot();
        if(!getRoot) return false;
        let shortcutMatch = path.match(/^\@[\w-]+/)[0]; 
        let directory = this.#shortcutMatchs[getRoot][shortcutMatch];
        return path.replace(shortcutMatch, directory);
    }

    #getRoot(){
        let path = dirname(this.getCallerPath());
        let modules = Object.keys(this.#shortcutMatchs).reverse();
        let getModule = this.#moduleFinder(path);

        return modules.find(getModule);
    }

    #moduleFinder(path){
        return (path)=>{
            let re = new RegExp(path.replace(/\\/g, `\\\\`))
            return !path.search(re);
        }
    }

    getRootPth(path){
        let getRoot = this.#getRoot();
        let directory = join(getRoot, path);
        let isExisrs = existsSync(directory) || existsSync(normalize(`${directory}/..`));

        return isExisrs && directory;
    }

    #findRootDir(path) {
        let packages = join(path, `package.json`)
        let parentPath = normalize(`${path}/..`)
        return existsSync(packages) ? path : this.#findRootDir(parentPath)
      }
    
    setShortcut(path){
        let rootPath = this.#findRootDir(path);
        if(!this.#shortcutMatchs[rootPath]){
            this.#shortcutMatchs[rootPath] = this.#getOption(rootPath);
        }
        return this.#shortcutMatchs[rootPath];
    }
    #getOption(path){
        let paths = join(path, `.paths`);

        if(!existsSync(paths)) return {};
        let pathsContent = readFileSync(paths, {encoding: `utf8`});
        let re = /(\@[\w-]+)\s*=\s*(.+)/gm;
        let match, option = {}
        while(match = re.exec(pathsContent)){
            let name = match[1];
            let value = match[2];
            let directory = value === `/` ? path : join(path, value);
            option[name] = directory;
        }
        return option;

    }
    GetTheFileData(path){
        // read the JSON file 
        let exactPath = this.setShortcutsPath(path);
        let isFileExists = existsSync(exactPath);
        if(!isFileExists) return false;
        let data = fs.readFileSync(exactPath, {encoding: `utf8`}, (err, data) => {
            if(err) throw err;
            return JSON.parse(data);
        });
        return data;
    }
    // Check the file is a module or a file
    isFileAndIsExist =(path)=>{
        let isJson = path.includes('.json');
        if(!isJson) return [false, false];
        let exactPath= this.setShortcutsPath(path);
        let isFileExists = existsSync(exactPath);
        return [isJson, isFileExists];
    }
    isModuleAndIsExist =(path)=>{
        let isJsFile = path.includes('.js');
        return isJsFile;
    }

}

class Safeloader{
    constructor(){
        throw new Error("Safeloader is a singleton class. Use getInstance() instead.");
    }
    #path = "";

    static getInstance(path){
        if(!PrivateSafeloader.instance){
            PrivateSafeloader.instance = new PrivateSafeloader(path);
        }
        return PrivateSafeloader.instance;
    }
    
   
}

module.exports = Safeloader;