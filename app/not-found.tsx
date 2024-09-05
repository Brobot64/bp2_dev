import Link from 'next/link';
import styles from './NotFound.module.css';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
            <h1 className={styles.bigText}>
                4<span>[</span>&nbsp;<span>]</span>4
            </h1>
        </div>
        <div className={styles.textContainer}>
          <p>Could not find the requested resource.</p>
          <p>
            We are a foresight company, so we know that this is not what we&apos;re looking for.
            But let&apos;s make the most of it.
          </p>
          <p>
            The origins of the 404 error go back to the founding of the WWW at CERN. Room 404
            was the server room of the first web server.
          </p>
          <p>
            At least you&rsquo;ve learned something, so this hasn&rsquo;t been a total loss.
          </p>
          <Link href="/">
            Click here to move on…
          </Link>
        </div>
      </div>
    </div>
  );
}
