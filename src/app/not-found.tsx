export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-lg font-semibold">페이지를 찾을 수 없습니다</h2>
      <a href="/dashboard" className="mt-4 text-blue-500 underline">
        대시보드로 돌아가기
      </a>
    </div>
  );
}
