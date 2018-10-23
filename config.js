const app_path = proccess.cwd();

module.exports = {
  zip_folder: app_path + '/zip-folder',
  zip_files: [
    app_path + '/zip-folder/file1.log', 
    app_path + '/zip-folder/file2.log',
  ],
}