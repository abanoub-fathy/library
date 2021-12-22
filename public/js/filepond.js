// register the plugins first
FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode,
  FilePondPluginFileValidateType
);

// set options
FilePond.setOptions({
  stylePanelAspectRatio: 150 / 100,
  imageResizeTargetWidth: 100,
  imageResizeTargetHeight: 150,
  acceptedFileTypes: ["image/jpeg", "image/png", "image/gif"],
});

// apply filepond on all file inputs
FilePond.parse(document.body);

// remove the link of file bond
document.querySelector("a.filepond--credits").style.display = "none";
