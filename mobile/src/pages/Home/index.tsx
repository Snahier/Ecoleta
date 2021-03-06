import React, { useState, useEffect } from "react"
import { View, Image, StyleSheet, Text, ImageBackground } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { Feather as Icon } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import RNPickerSelect from "react-native-picker-select"
import Axios from "axios"

interface IIbgeUfResponse {
  sigla: string
}
interface IIbgeCityResponse {
  nome: string
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState("0")
  const [cities, setCities] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState("0")

  const navigation = useNavigation()

  useEffect(() => {
    Axios.get<IIbgeUfResponse[]>(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
    ).then((response) => {
      const ufInitials = response.data.map((uf) => uf.sigla)
      setUfs(ufInitials)
    })
  }, [])

  useEffect(() => {
    if (selectedUf === "0") {
      return
    }
    Axios.get<IIbgeCityResponse[]>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
    ).then((response) => {
      const cityNames = response.data.map((city) => city.nome)
      setCities(cityNames)
    })
  }, [selectedUf])

  function handleNavigateToPoints(uf: string, city: string) {
    navigation.navigate("Points", { uf, city })
  }

  function handleSelectUf(uf: string) {
    setSelectedUf(uf)
  }

  function handleSelectedCity(city: string) {
    setSelectedCity(city)
  }

  return (
    <ImageBackground
      source={require("../../assets/home-background.png")}
      imageStyle={{ width: 274, height: 368 }}
      style={styles.container}
    >
      <View style={styles.main}>
        <Image source={require("../../assets/logo.png")} />
        <Text style={styles.title}>
          Seu marketplace para coleta de resíduos
        </Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
        </Text>
      </View>

      <View style={styles.footer}>
        {ufs && (
          <RNPickerSelect
            onValueChange={(uf) => handleSelectUf(uf)}
            items={ufs.map((uf) => ({ label: uf, value: uf }))}
            placeholder={{ label: "Estado - UF" }}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
          />
        )}
        {cities && (
          <RNPickerSelect
            onValueChange={(city) => handleSelectedCity(city)}
            items={cities.map((city) => ({ label: city, value: city }))}
            placeholder={{ label: "Cidade" }}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
          />
        )}
        <RectButton
          style={styles.button}
          onPress={() => handleNavigateToPoints(selectedUf, selectedCity)}
        >
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#fff" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginVertical: 5,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
})

export default Home
