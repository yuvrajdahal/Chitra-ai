export default function Footer() {
  return (
    <footer className="container relative m-4 mx-auto rounded-lg border border-gray-600 bg-gray-900   shadow ">
      <div className="mx-auto w-full max-w-screen-xl p-4 md:flex md:items-center md:justify-center">
        <span className="text-sm text-gray-500 dark:text-gray-400 sm:text-center">
          © 2023 <button className="">Yuvraj</button> | Made with{" "}
          <a className="hover:underline" href="https://nextjs.org/">
            Next Js
          </a>
        </span>
      </div>
    </footer>
  );
}
