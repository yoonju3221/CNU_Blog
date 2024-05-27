import { ChangeEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { createPost, getPostById, updatePostById } from '../api';
import { TAG } from '../api/types';

const TitleInput = styled.input`
  display: block;
  width: 100%;
  height: 66px;
  background: transparent;
  padding: 2rem 0 0 0;
  font-size: 2.75rem;
  resize: none;
  line-height: 1.5;
  outline: none;
  border: none;
  font-weight: bold;
  color: #212529;
`;

const TagSelect = styled.select`
  font-size: 1.125rem;
  line-height: 2rem;
  margin-bottom: 0.75rem;
  min-width: 8rem;
  color: #212529;
  border: none;
`;

const Editor = styled.textarea`
  width: 100%;
  height: calc(100% - 200px);
  min-height: 100px;
  border: none;
  resize: none;
  font-size: 1.125rem;
  flex: 1 1 0%;
`;

const BottomSheet = styled.div`
  bottom: 0;
  width: 760px;
  height: 4rem;
  background: #ffffff;
  border-top: 1px solid #ddd;
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
`;

const ExitButton = styled.button`
  height: 2.5rem;
  padding: 0.5rem 1rem;
  -webkit-box-align: center;
  align-items: center;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  display: flex;
  outline: none;
  color: #212529;
  font-size: 1.125rem;
`;

const SaveButton = styled.button`
  height: 2rem;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 1rem;
  border-radius: 4px;
  outline: none;
  font-weight: bold;
  word-break: keep-all;
  background: rgb(50, 148, 248);
  border: 1px solid rgb(50, 148, 248);
  color: #ffffff;
  transition: all 0.125s ease-in 0s;
  cursor: pointer;
`;

const Write = () => {
  // todo (5) 게시글 작성 페이지 만들기
  const { state } = useLocation();
  const isEdit = state?.postId;
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [tag, setTag] = useState<TAG>(() => {
    return Object.keys(TAG)[0] as TAG;
  });
  const tagList = Object.keys(TAG);
  const navigate = useNavigate();

  const fetchPostById = async (postId: string) => {
    const { data: post } = await getPostById(postId);
    setTitle(post.title);
    setContents(post.contents);
    setTag(post.tag);
  };

  useEffect(() => {
    if (isEdit) {
      fetchPostById(state.postId);
    }
  }, []);
  const requestCreatePost = async () => {
    await createPost(title, contents, tag);
  };

  const requestUpdatePost = async () => {
    await updatePostById(state.postId, title, contents, tag);
  };
  const clickConfirm = () => {
    if (!title || !contents) {
      alert('빈 값이 있습니다.');
      return;
    }
    if (isEdit) {
      requestUpdatePost();
    } else {
      requestCreatePost();
    }
    navigate('/');
  };
  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const handleChangeContents = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContents(event.target.value);
  };
  const handleChangeTag = (event: ChangeEvent<HTMLSelectElement>) => {
    setTag(event.target.value as TAG);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ height: 'calc(100% - 4rem)', paddingBottom: '4rem' }}>
        <TitleInput placeholder="제목을 입력하세요" value={title} onChange={event => handleChangeTitle(event)} />
        <TagSelect placeholder="태그를 선택하세요" value={tag} onChange={handleChangeTag}>
          {tagList.map(tag => (
            <option key={tag}>{tag}</option>
          ))}
        </TagSelect>
        <Editor placeholder="내용을 입력하세요" value={contents} onChange={handleChangeContents} />
      </div>
      <BottomSheet>
        <Link to="/">
          <ExitButton>나가기</ExitButton>
        </Link>
        <SaveButton onClick={clickConfirm}>저장하기</SaveButton>
      </BottomSheet>
    </div>
  );
};

export default Write;
