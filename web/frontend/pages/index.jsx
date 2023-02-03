/* eslint-disable import/first */
import { ContextualSaveBar, ResourcePicker, useAppBridge, useNavigate, TitleBar, Loading } from "@shopify/app-bridge-react";
import {
  Card,
  EmptyState,
  Layout,
  Page,
  SkeletonBodyText,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";

import { useAuthenticatedFetch, useAppQuery } from "../hooks";


export default function HomePage() {
  /*
    Add an App Bridge useNavigate hook to set up the navigate function.
    This function modifies the top-level browser URL so that you can
    navigate within the embedded app and keep the browser in sync on reload.
  */
  const navigate = useNavigate();

  /*
    These are mock values. Setting these values lets you preview the loading markup and the empty state.
  */

  const isLoading = false;
  const isRefetching = false;
  const [showResourcePicker, setShowResourcePicker] = useState(false);
  const appBridge = useAppBridge();
  const getURL = (url, headers) => {
    console.log("URL is: %s", url)
      fetch(url, {
    method: 'get',
    headers: headers,
      }).then((res) => res.text()).then((data) => {
        console.log(data);
      }).catch((err) => {
        console.log(err.message);
      });
    //return
  }

  console.log(import.meta.env);

  const handleProductChange = useCallback(({ selection }) => {
    console.log("TEST");
    console.log(selection);
    for (const element of selection){
      console.log(element.id);
      const productId = element.id.split("/").pop();
      console.log(productId);
      const shopify_django_apis_url = import.meta.env.VITE_SHOPIFY_DJANGO_APIS_URL;
      const url = shopify_django_apis_url + "generate_barcodes/" + productId;
      const shopify_django_apis_token = import.meta.env.VITE_SHOPIFY_DJANGO_APIS_TOKEN;
      const headers = new Headers({'Authorization': 'Token ' + shopify_django_apis_token});
      console.log(url);
      getURL(url, headers);
    }

    setShowResourcePicker(false);
  }, []);


  const toggleResourcePicker = useCallback(
    () => setShowResourcePicker(!showResourcePicker),
    [showResourcePicker]
  );

  /* loadingMarkup uses the loading component from AppBridge and components from Polaris  */
  const loadingMarkup = isLoading ? (
    <Card sectioned>
      <Loading />
      <SkeletonBodyText />
    </Card>
  ) : null;

  /* Use Polaris Card and EmptyState components to define the contents of the empty state */
  const createBarcodesMarkup =
    !isLoading ? (
      <Card sectioned>
        <EmptyState
          heading="Create barcodes"
          /* This button will take the user to a Create a QR code page */
          action={{
            content: "Create Barcodes",
            onAction: toggleResourcePicker,
          }}
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>
            Create barcodes for variants that do not have a barcode.
          </p>
        </EmptyState>


      </Card>


    ) : null;

  const showProductPicker =
    !isLoading ?(
      <Card.Section>
        {showResourcePicker && (
          <ResourcePicker
          resourceType="Product"
          showVariants={false}
          selectMultiple={true}
          onCancel={toggleResourcePicker}
          onSelection={handleProductChange}
          open
          />
        )}
        </Card.Section>
    ) : null;


  /*
    Use Polaris Page and TitleBar components to create the page layout,
    and include the empty state contents set above.
  */
  return (
    <Page>
      <TitleBar
        title="Create Barcodes"
        primaryAction={{
          content: "Create barcodes",
          onAction: toggleResourcePicker,
        }}
      />
      <Layout>
        <Layout.Section>
          {loadingMarkup}
          {createBarcodesMarkup}
          {showProductPicker}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
