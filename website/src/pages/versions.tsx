import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

const VersionsPage: React.FC = () => {
  const { siteConfig } = useDocusaurusContext();
  const latestVersion = siteConfig.customFields.latestVersion as string;
  const versions = siteConfig.customFields.versions as string[] | [];

  return (
    <Layout title="Versions" description="ESBoot Documentation Versions page">
      <main className="container margin-vert--lg">
        <Heading as="h1">ESBoot Documentation Versions</Heading>

        <div className="margin-bottom--lg">
          <h3 id="latest">Latest Version (Stable)</h3>
          <p>Here you can find the latest documentation.</p>
          <table>
            <tbody>
              <tr>
                <th>{latestVersion}</th>
                <td>
                  <Link to="/docs/v3/intro">Documentation</Link>
                </td>
                <td>
                  <a
                    href={`https://github.com/moonlitusun/esboot/releases/tag/v${latestVersion}`}
                  >
                    Release Notes
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="margin-bottom--lg">
          <h3 id="archive">Past Versions</h3>
          <p>
            Here you can find documentation for previous versions of ESBoot.
          </p>
          <table>
            <tbody>
              {versions.map((version) => (
                <tr key={version}>
                  <th>{version}</th>
                  <td>
                    <Link to={`/docs/${version}/intro`}>Documentation</Link>
                  </td>
                  <td>
                    <a
                      href={`https://github.com/moonlitusun/esboot/releases/tag/v${version}`}
                    >
                      Release Notes
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </Layout>
  );
};

export default VersionsPage;
