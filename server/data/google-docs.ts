import googleDocs from '@googleapis/docs';
import googleDrive from '@googleapis/drive';

/**
 * Drive Permission Types
 */

type PermissionTypeEnum = 'user' | 'group' | 'domain' | 'anyone';
type PermissionRoleEnum ='owner' | 'organizer' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader';

/**
 * Google Docs Types
 */

type GDTextFormatName = 'heading1' | 'heading2' | 'heading3' | 'text' | 'bold' | 'italic';

type GDFontSize = {
  magnitude: number;
  unit: string;
};

type GDColor = {
  color: {
    rgbColor: {
      red: number;
      green: number;
      blue: number;
    }
  }
};

type GDTextFormat = Partial<{
  bold: boolean;
  italic: boolean;
  fontSize: GDFontSize;
  foregroundColor: GDColor;
}>;

type GDTextFormatMap = Partial<{
  [key in GDTextFormatName]: GDTextFormat;
}>

/**
 * Simple Google Docs API class
 */

class GoogleDocs {

  #docsClient: any = null;
  #driveClient: any = null;

  textFormats: GDTextFormatMap = {
    heading1: {
      bold: true,
      fontSize: {
        magnitude: 24,
        unit: 'PT',
      }
    },
    heading2: {
      bold: true,
      fontSize: {
        magnitude: 20,
        unit: 'PT',
      },
      foregroundColor: {
        color: {
          rgbColor: {
            red: 0.55686274509, // 142,
            green: 0.4862745098, // 124,
            blue: 0.76470588235, // 195
          }
        }
      },
    },
    heading3: {
      bold: true,
      fontSize: {
        magnitude: 16,
        unit: 'PT',
      }
    },
    text: {
      bold: false,
      italic: false,
      fontSize: {
        magnitude: 12,
        unit: 'PT',
      },
      foregroundColor: {
        color: {
          rgbColor: {
            red: 0,
            green: 0,
            blue: 0
          }
        }
      },
    },
    bold: {
      bold: true,
    },
    italic: {
      italic: true,
    }
  };


  constructor(formats?: GDTextFormatMap) {
    if (formats) {
      this.textFormats = {
        ...this.textFormats,
        ...formats
      };
    }
  }

  public async connect() {
    const auth = new googleDocs.auth.GoogleAuth({
      keyFilename: './google-service-account-key.json',
      scopes: [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive',
      ]
    });

    const authClient = await auth.getClient();

    this.#docsClient = await googleDocs.docs({
      version: 'v1',
      auth: authClient
    });

    this.#driveClient = await googleDrive.drive({
      version: 'v2',
      auth: authClient
    });
  }

  /**
   * Change document permissions
   */

  public async updatePermissions(fileId: string, type: PermissionTypeEnum, role: PermissionRoleEnum, emailAddress?: string): Promise<boolean> {
    const result = await this.#driveClient.permissions.insert({
      fileId,
      resource: {
        role,
        type,
        emailAddress
      }
    });

    if (result.status !== 200) {
      console.warn('Failed to update permissions');
      console.warn(result.status);
      console.warn(result.statusText);
      return false;
    }
    return true;
  }

  /**
   * Prepare content for Google Docs edit API
   * @returns Array of content for API param
   */

  public prepareContent(content: Array<any>): Array<any> {
    // slice() so this function doesn't mutate the original content[] array param when I do content.reverse().
    const contentArr = content.slice(0).reverse();
    const firstParaIndex = contentArr.length - 1;

    return contentArr.reduce((acc: any[], paragraph: [string, GDTextFormatName[]][], i: number) => {
      const paragraphArr = paragraph.slice(0).reverse();
      const pLen = paragraphArr.length;

      for (let ii = 0; ii < pLen; ii++) {
        const line = paragraphArr[ii];
        const [str, formats] = line;
        const isNewParagraph = ii === (pLen - 1) && i !== firstParaIndex;
        const text = isNewParagraph ? '\n\n' + str : str;

        acc.push({
          insertText: {
            text,
            ...(i || ii ? {
              location: {
                index: 1
              }
            } : {
              endOfSegmentLocation: {}
            })
          },
        });

        const textStyle = (formats?.length ? formats : ['text']).reduce((acc: GDTextFormat, format: GDTextFormatName) => {
          return {
            ...acc,
            ...this.textFormats[format]
          };
        }, {});

        acc.push({
          updateTextStyle: {
            range: {
              startIndex: 1,
              endIndex: text.length + 1
            },
            textStyle,
            fields: Object.keys(textStyle).join(',')
          }
        });
      }

      return acc;
    }, []);
  }

  /**
   * Batch update a document
   */

  public async batchUpdateDocument(documentId: string, content: Array<any>): Promise<boolean> {

    const preparedContent = this.prepareContent(content);
    // console.log('preparedContent');
    // console.log(preparedContent);

    const result = await this.#docsClient.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: preparedContent
      }
    });

    if (result.status !== 200) {
      console.warn('Failed to batch update');
      console.warn(result.status);
      console.warn(result.statusText);
      return false;
    }

    return true;
  }


  /**
   * Create a new Google Docs document
   * @returns documentID or null
   */

  public async createDocument(title: string, content: Array<any>): Promise<string | null> {

    const created = await this.#docsClient.documents.create({
      requestBody: {
        title
      },
    });

    if (created.status === 200) {
      await GD.updatePermissions(created.data.documentId, 'anyone', 'reader');

      // It's probably possible to create a Google Docs document with content;
      // But at a glance, I noticed the {requestBody} structure was different
      // between edit and create.
      // So, for now, I decided to learn just 1 {requestBody} structure (for time, mostly).
      // But it "would" be nice to createDocument() with content in a single API call instead of 2.
      await this.batchUpdateDocument(created.data.documentId, content);

      return created.data.documentId;
    }

    return null;
  }

  /**
   * Get document file
   */

  public async getDocument(documentId: string): Promise<any> {
    const result = await this.#docsClient.documents.get({documentId});
    // console.log(result.data);
    return result.data;
  }

}

/**
 * Main export
 */

const GD = new GoogleDocs();
GD.connect();

export default GD;
