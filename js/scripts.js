// TODO: implement function to see markdown preview

// TODO: implement function that handle buttons to change between text styles
// i.e., H1, H2, H3... bold, italics, etc..

// https://stackoverflow.com/a/30832210
// TODO: save into a .zip file, containing also git changes of that file
// So we can load from that point... We could also save snapshots of the diffs and create
// the commits from there? idk...
const saveLocalFile = (blob, filename) => {
    const file = blob;
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        const a = document.createElement('a');
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
    return file;
}

const onSave = (event) => {
    event.preventDefault();
    const bodyContent = document.getElementById('body-content').innerHTML;
    const file = document.getElementById('doc-title').value;
    const extension = '.md';
    const filename = `${file || 'filename'}${extension}`;
    const blob = new Blob([bodyContent], {type: 'text/plain;charset=utf-8'});
    window.alert('Hint: Open dev tools!');
    console.log(
        'This is an idea of what we can send to the backend:',
        '\n\n',
        `
{
    title: '  GET FROM FIRST LINE OF BODY CONTENT '
    filename: ${filename},
    blob: ${blob},
    body: 
    """
        ${bodyContent}
    """
    ,
}
        `
    );
    // TODO: Implement function to save file -> sendToBackend(blob, filename, ...);

    // TODO: Add toggle to enable/disable a local copy
    const saveLocal = document.getElementById('save-local').checked;
    if (saveLocal) {
        saveLocalFile(blob, filename);
    }
};
