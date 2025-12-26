'use client';

import { useCreatePost, useDeletePost, useUpdatePost } from '@domains/example';
import { useState } from 'react';

import { ExampleLayout, InfoBox } from '../_components';
import styles from './page.module.scss';

/**
 * Mutation (데이터 변경) 예제
 *
 * 동작 방식:
 * 1. useMutation 훅으로 생성/수정/삭제 작업 수행
 * 2. Mutation 실행 중 전역 로딩이 자동으로 표시됨
 * 3. 성공 시 관련 쿼리를 자동으로 무효화하여 최신 데이터 유지
 * 4. 에러 발생 시 GlobalErrorHandler에서 처리
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
      setResult(`✅ 게시글 생성 완료! ID: ${newPost.id}`);
      setTitle('');
      setBody('');
    } catch (error) {
      setResult(`❌ 생성 실패: ${error}`);
    }
  };

  const handleUpdate = async () => {
    try {
      await updatePost.mutateAsync({
        id: 1,
        data: { title: '수정된 제목', body: '수정된 내용' },
      });
      setResult('✅ 게시글 수정 완료! ID: 1');
    } catch (error) {
      setResult(`❌ 수정 실패: ${error}`);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost.mutateAsync(1);
      setResult('✅ 게시글 삭제 완료! ID: 1');
    } catch (error) {
      setResult(`❌ 삭제 실패: ${error}`);
    }
  };

  return (
    <ExampleLayout title="Mutation (데이터 변경) 예제" description="생성, 수정, 삭제 작업 시 전역 로딩이 자동으로 표시됩니다.">
      <InfoBox title="💡 동작 원리">
        <ul>
          <li>
            • Mutation 실행 중 <code>useIsMutating()</code>이 감지되어 전역 로딩 표시
          </li>
          <li>• 성공 시 관련 쿼리를 자동으로 무효화하여 최신 데이터 유지</li>
          <li>• 에러 발생 시 GlobalErrorHandler에서 처리</li>
          <li>• Optimistic Update, Rollback 등 고급 패턴도 지원</li>
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
        <h3>2. 게시글 수정 / 삭제</h3>
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

      <InfoBox title="🎯 테스트 방법" variant="info">
        <ol>
          <li>1. 제목과 내용을 입력하고 &quot;게시글 생성&quot; 클릭</li>
          <li>2. 전역 로딩이 표시되고 1초 후 완료 메시지 표시</li>
          <li>3. &quot;수정&quot; 또는 &quot;삭제&quot; 버튼 클릭하여 다른 Mutation 테스트</li>
          <li>4. 각 작업마다 전역 로딩이 자동으로 표시됩니다</li>
        </ol>
      </InfoBox>
    </ExampleLayout>
  );
}
