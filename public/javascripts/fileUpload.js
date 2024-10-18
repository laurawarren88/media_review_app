document.addEventListener('DOMContentLoaded', function() {
    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode
    )

FilePond.create(document.querySelector('input[type="file"]'), {
    allowImagePreview: true,
    allowFileEncode: true,
    imagePreviewMaxHeight: 150,
    imageCropAspectRatio: '1:1',
    imageResizeTargetWidth: 200,
    imageResizeTargetHeight: 200,
    stylePanelAspectRatio: 150 / 100,
});

const inputElement = document.querySelector("input[type='file']");

const pond = FilePond.create(inputElement);

});