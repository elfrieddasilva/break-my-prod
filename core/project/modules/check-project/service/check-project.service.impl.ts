import { ProjectType } from "@/core/shared/types/project-type";
import { InvalidGithubProjectException, ProjectTypeException } from "../check-project.exception";
import { CheckProjectService } from "./check-project.service";

export class CheckProjectServiceImpl implements CheckProjectService {
   async validateGithubUrl(url: string): Promise<boolean> {
        try {
            if (!this.isGithubUrl(url))
                throw new Error("invalid github url");
            const parsedGithubUrl = await this.parseToGithubUrl(url);
            if (parsedGithubUrl)
                return Promise.resolve(true);
            return Promise.resolve(false);

        } catch (error) {
            throw new InvalidGithubProjectException((error as Error).message);
        }

    }

    async parseToGithubUrl(url: string) {
        let parsedUrl: string | null = url;
        if (parsedUrl.includes("http") || parsedUrl.includes("https")) {
           parsedUrl = this.removeHttpKeywordFromUrl(parsedUrl);
        }
        if (url.includes("www")) {
            parsedUrl = this.removeWWWKeywordFromUrl(parsedUrl);
            if (parsedUrl !== null)
                return Promise.resolve(parsedUrl);
            throw new Error("error while parsing github url");
        }
        return parsedUrl;
    }


    private removeHttpKeywordFromUrl(url: string) {
        return (url.split('//'))[1];
    }

    private removeWWWKeywordFromUrl(url: string): string | null {
        const urlWithoutWWWKeyWord = url.split('.');
        if (urlWithoutWWWKeyWord.length === 3) {
            return (urlWithoutWWWKeyWord[1] + '.' + urlWithoutWWWKeyWord[2]);
        }
        return null;
    }

    private isGithubUrl(url: string) {
        return (url.includes("github.com"))
    }

    async detectProjectType(githubUrl: string): Promise<ProjectType> {
      try {
        await this.validateGithubUrl(githubUrl);
        return Promise.resolve("nodejs");
      } catch (error) {
        throw new ProjectTypeException((error as Error).message);
      }
    }
    
}