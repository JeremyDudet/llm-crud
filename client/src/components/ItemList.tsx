import React from "react";
import { useItems } from "../hooks/useApi";

const ItemList: React.FC = () => {
  const { isLoading, error, data } = useItems();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <ul>
      {data?.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

export default ItemList;
