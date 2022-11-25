import CustomizedNode from '../customizedNode';

function Listen({ data }) {
  return (
    <div>
      <CustomizedNode title="Listen" content="Connect to Intent Model" id={data.id} handleDelete={data.handleDelete} />
    </div>
  );
}

export default Listen;