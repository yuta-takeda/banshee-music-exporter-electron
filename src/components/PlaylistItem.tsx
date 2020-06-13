import React, { useState } from "react";

interface IProps {
  name: string;
}

const PlaylistItem: React.FC<IProps> = props => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div>
      <p onClick={() => setIsChecked(!isChecked)}>
        <input type="checkbox" checked={isChecked} onChange={e => setIsChecked(e.currentTarget.checked)} />
        <span>{props.name}</span>
      </p>
    </div>
  );
};

export default PlaylistItem;
