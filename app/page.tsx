"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  GithubIcon,
  LinkedinIcon,
  Mail,
  FileText,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Header } from "@/components/ui/header";
import { useTypewriter } from "@/hooks/useTypewriter";
import { VideoModal } from "@/components/ui/video-modal";
import Link from "next/link";
import { articles, ongoing, projects, socials, videos } from "./util/data";
import { VideoSection } from "@/components/section/video-section";

export default function Home() {
  const typedText = useTypewriter("Hi, I'm Ronak");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-8 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary"
            >
              <img
                src="/me.jpg"
                alt="Ronak"
                className="object-cover w-full h-full"
              />
            </motion.div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{typedText}</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Flutter Developer & Content Creator
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/expandable">
              <Button variant="default" size="lg">
                Contact Me <Mail className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/resume.pdf" target="_blank">
              <Button variant="outline" size="lg">
                View Resume <FileText className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Current Work Section */}
      <section className="bg-muted py-16" id="projects">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-8">Currently Working On</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ongoing.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col">
                    <div className="p-6 flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {item.description}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {item.date}
                      </p>
                      <Button variant="link" className="p-0" asChild>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Learn more <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="container mx-auto px-4 py-16" id="articles">
        <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col">
                <div className="p-6 flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {article.description}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {article.date}
                  </p>
                  <Button variant="link" className="p-0" asChild>
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read on Medium <BookOpen className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects & Videos Section */}
      <section className="container mx-auto px-4 py-16" id="videos">
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>
          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <AspectRatio ratio={16 / 9}>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {project.description}
                      </p>
                      <Link href={project.link} target="_blank">
                        <Button variant="link" className="p-0">
                          View Project <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="videos">
            <VideoSection videos={videos} />
          </TabsContent>
        </Tabs>
      </section>

      {/* Resume Section */}
      <section className="bg-muted py-16" id="resume">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-8">Resume</h2>
            <Card className="p-6 max-w-2xl mx-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">Experience</h3>
                  <p className="text-muted-foreground">
                    Flutter Developer at{" "}
                    <Link
                      href="https://pustack.com"
                      target="_blank"
                      className="hover:underline"
                    >
                      PuStack
                    </Link>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    2021 - Present
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Education</h3>
                  <p className="text-muted-foreground">
                    Computer Science, RGPV
                  </p>
                  <p className="text-sm text-muted-foreground">2017 - 2021</p>
                </div>
              </div>
              <Link
                href="/resume.pdf"
                target="_blank"
                className="flex justify-center w-full"
              >
                <Button className="mt-6">
                  View Full Resume <FileText className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8">
        <div className="flex justify-center space-x-4">
          {socials.map((social) => (
            <Link key={social.link} href={social.link} target="_blank">
              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-700 hover:text-white transition-colors"
              >
                {social.type === "linkedin" ? (
                  <LinkedinIcon className="h-5 w-5" />
                ) : social.type === "github" ? (
                  <GithubIcon className="h-5 w-5" />
                ) : (
                  <Mail className="h-5 w-5" />
                )}
              </Button>
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
