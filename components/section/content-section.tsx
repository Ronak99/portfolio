import { motion } from "framer-motion";

type Props = {
  id: string;
  title: string;
  subtitle: string;
  isMuted: boolean;
  children: React.ReactElement;
};

export default function ContentSection({
  id,
  title,
  subtitle,
  isMuted,
  children,
}: Props) {
  return (
    <section
      className={`${isMuted ? "bg-muted" : "bg-transparent"} py-16`}
      id={id}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <h2 className="text-xl mb-8 text-muted-foreground">{subtitle}</h2>
          {children}
        </motion.div>
      </div>
    </section>
  );
}
