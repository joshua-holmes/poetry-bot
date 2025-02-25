import Chat from './Chat'
import styles from "./container.module.css"; // use simple styles for demonstration purposes

function Container() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Chat />
      </div>
    </main>
  )
}

export default Container;
