import CustomizedNode from '../customizedNode';

function AudioUpload({ data }) {
  return (
    <div>
      <CustomizedNode title="Audio" content="Audio File.mp3" id={data.id} handleDelete={data.handleDelete} />
    </div>
  );
}

export default AudioUpload;