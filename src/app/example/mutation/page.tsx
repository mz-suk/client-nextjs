'use client';

import { ExampleLayout, InfoBox, useCreatePost, useDeletePost, useUpdatePost } from '@domains/example';
import { useState } from 'react';

import styles from './page.module.scss';

/**
 * Mutation (데이터 변경) 예제
 *
 * 생성, 수정, 삭제 작업과 자동 캐시 무효화를 보여줍니다.
 */
export default function MutationPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [result, setResult] = useState<string>('');

  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const handleCreate = async () => {
    if (!title || !body) {
      alert('제목과 내용을 입력해주세요');
      return;
    }

    try {
      const newPost = await createPost.mutateAsync({
        title,
        body,
        userId: 1,
      });
      setResult(`✅ 생성 완료! ID: ${newPost.id}`);
      setTitle('');
      setBody('');
    } catch (error) {
      setResult(`❌ 실패: ${error}`);
    }
  };

  const handleUpdate = async () => {
    try {
      await updatePost.mutateAsync({
        id: 1,
        data: { title: '수정된 제목', body: '수정된 내용' },
      });
      setResult('✅ 수정 완료! ID: 1');
    } catch (error) {
      setResult(`❌ 실패: ${error}`);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost.mutateAsync(1);
      setResult('✅ 삭제 완료! ID: 1');
    } catch (error) {
      setResult(`❌ 실패: ${error}`);
    }
  };

  return (
    <ExampleLayout title="Mutation (데이터 변경)" description="생성, 수정, 삭제 작업 및 자동 캐시 무효화 예제입니다.">
      <InfoBox title="💡 동작 원리">
        <ul>
          <li>Mutation 실행 중 `useIsMutating()`이 감지되어 전역 로딩이 표시됩니다.</li>
          <li>성공 시 `queryClient.invalidateQueries()`를 통해 목록을 자동으로 갱신합니다.</li>
          <li>에러 발생 시 GlobalErrorHandler에서 처리됩니다.</li>
        </ul>
      </InfoBox>

      {/* 생성 폼 */}
      <section className={styles.section}>
        <h3>1. 게시글 생성</h3>
        <div className={styles.formGroup}>
          <input type="text" placeholder="제목" value={title} onChange={e => setTitle(e.target.value)} className={styles.input} />
          <textarea placeholder="내용" value={body} onChange={e => setBody(e.target.value)} rows={4} className={styles.textarea} />
          <button onClick={handleCreate} disabled={createPost.isPending} className={`${styles.button} ${styles.primary}`}>
            {createPost.isPending ? '생성 중...' : '게시글 생성'}
          </button>
        </div>
      </section>

      {/* 수정/삭제 */}
      <section className={styles.section}>
        <h3>2. 수정 / 삭제 (ID: 1)</h3>
        <div className={styles.buttonGroup}>
          <button onClick={handleUpdate} disabled={updatePost.isPending} className={`${styles.button} ${styles.success}`}>
            {updatePost.isPending ? '수정 중...' : 'ID 1 수정'}
          </button>
          <button onClick={handleDelete} disabled={deletePost.isPending} className={`${styles.button} ${styles.danger}`}>
            {deletePost.isPending ? '삭제 중...' : 'ID 1 삭제'}
          </button>
        </div>
      </section>

      {/* 결과 표시 */}
      {result && <div className={`${styles.result} ${result.startsWith('✅') ? styles.success : styles.error}`}>{result}</div>}
    </ExampleLayout>
  );
}
