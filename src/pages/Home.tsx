import { useEffect, useState } from 'react';
import { getPostList } from '../api';
import PostListItem from '../components/PostListItem';
import { IResponsePostList} from '../api/types';
import NoPostList from '../components/NoPostList';


const Home = () => {
  const [postList, setPostList] = useState<IResponsePostList>([]);
  const fetchPostList = async () => {
    const { data } = await getPostList();
    const sortedList = data.sort((postA, postB) => {
      if (postA.id >= postB.id) return -1;
      else return 1;
    });
    setPostList(sortedList);
  };
  useEffect(() => {
    fetchPostList();
  }, []);
  if (postList.length === 0) {
    return <NoPostList />;
  }
  return (
    <div>
      {postList.map(item => (
        <PostListItem key={item.id} {...item} />
        // <PostListItem key={item.id} id={`${item.id}`} title={item.title} contents={item.contents} tag={item.tag} />
      ))}
    </div>
  );
};

export default Home;
