'use client';

import { useCreatePost, useDeletePost, useUpdatePost } from '@domains/example';
import { useState } from 'react';

/**
 * Mutation (데이터 변경) 예제
 *
 * 동작 방식:
 * 1. useMutation 훅으로 생성/수정/삭제 작업 수행
 * 2. Mutation 실행 중 전역 로딩이 자동으로 표시됨
 * 3. 성공 시 관련 쿼리를 자동으로 무효화하여 최신 데이터 유지
 * 4. 에러 발생 시 QueryErrorBoundary에서 처리
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
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>Mutation (데이터 변경) 예제</h1>
        <p style={{ color: '#6b7280', lineHeight: '1.6' }}>생성, 수정, 삭제 작업 시 전역 로딩이 자동으로 표시됩니다.</p>
      </header>

      <div style={{ marginBottom: '32px', padding: '20px', background: '#f3f4f6', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px' }}>💡 동작 원리</h2>
        <ul style={{ lineHeight: '1.8', color: '#4b5563' }}>
          <li>
            • Mutation 실행 중 <code>useIsMutating()</code>이 감지되어 전역 로딩 표시
          </li>
          <li>• 성공 시 관련 쿼리를 자동으로 무효화하여 최신 데이터 유지</li>
          <li>• 에러 발생 시 QueryErrorBoundary에서 처리</li>
          <li>• Optimistic Update, Rollback 등 고급 패턴도 지원</li>
        </ul>
      </div>

      {/* 생성 폼 */}
      <section style={{ marginBottom: '32px', padding: '24px', border: '2px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>1. 게시글 생성</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
            }}
          />
          <textarea
            placeholder="내용"
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={4}
            style={{
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
              resize: 'vertical',
            }}
          />
          <button
            onClick={handleCreate}
            disabled={createPost.isPending}
            style={{
              padding: '12px 24px',
              background: createPost.isPending ? '#d1d5db' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              cursor: createPost.isPending ? 'not-allowed' : 'pointer',
            }}
          >
            {createPost.isPending ? '생성 중...' : '게시글 생성'}
          </button>
        </div>
      </section>

      {/* 수정/삭제 */}
      <section style={{ marginBottom: '32px', padding: '24px', border: '2px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>2. 게시글 수정 / 삭제</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleUpdate}
            disabled={updatePost.isPending}
            style={{
              flex: 1,
              padding: '12px 24px',
              background: updatePost.isPending ? '#d1d5db' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              cursor: updatePost.isPending ? 'not-allowed' : 'pointer',
            }}
          >
            {updatePost.isPending ? '수정 중...' : 'ID 1 수정'}
          </button>
          <button
            onClick={handleDelete}
            disabled={deletePost.isPending}
            style={{
              flex: 1,
              padding: '12px 24px',
              background: deletePost.isPending ? '#d1d5db' : '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              cursor: deletePost.isPending ? 'not-allowed' : 'pointer',
            }}
          >
            {deletePost.isPending ? '삭제 중...' : 'ID 1 삭제'}
          </button>
        </div>
      </section>

      {/* 결과 표시 */}
      {result && (
        <div
          style={{
            padding: '16px',
            background: result.startsWith('✅') ? '#d1fae5' : '#fee2e2',
            borderRadius: '8px',
            marginBottom: '32px',
          }}
        >
          {result}
        </div>
      )}

      <div style={{ padding: '20px', background: '#eff6ff', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '12px' }}>🎯 테스트 방법</h3>
        <ol style={{ lineHeight: '1.8', color: '#1e40af' }}>
          <li>1. 제목과 내용을 입력하고 &quot;게시글 생성&quot; 클릭</li>
          <li>2. 전역 로딩이 표시되고 1초 후 완료 메시지 표시</li>
          <li>3. &quot;수정&quot; 또는 &quot;삭제&quot; 버튼 클릭하여 다른 Mutation 테스트</li>
          <li>4. 각 작업마다 전역 로딩이 자동으로 표시됩니다</li>
        </ol>
      </div>
    </div>
  );
}
